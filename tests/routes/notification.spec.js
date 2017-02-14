/* global sinon, expect, beforeEach, afterEach, it, describe, context */
import Jwt from 'jsonwebtoken';
import github from '../../server/controller/githubController';
import socket from '../../server/controller/socket/handlers';
import server from '../../server/server';
import models from '../../server/data/models/modelManager';
import config from 'config';

describe('Notification', function() {
  beforeEach(function(done) {
    this.sandbox = sinon.sandbox.create();
    this.socketMock = this.sandbox.mock(socket);
    this.githubMock = this.sandbox.mock(github);

    models.User
      .create({
        id: 'user1',
        github_login: 'github_login1',
      })
      .then((newUser) => {
        this.user = newUser;
      })
      .then(() => models.Project.create({
        id: 'project1',
        content: 'project content',
        github_repo_owner: 'user1',
        github_repo_name: 'repo_name',
      }))
      .then((newProject) => {
        this.project = newProject;
        return this.user.addProject(this.project);
      })
      .then(() => models.Notification.create({
        id: 'notification1',
        data: JSON.stringify({
          user_id: this.user.id,
          project_id: this.project.id,
        }),
        template: 'template1',
        is_read: false,
      }))
      .then((newNotification) => {
        this.notification = newNotification;
        return this.user.addNotification(this.notification);
      })
      .then(() => {
        done();
      });
  });

  afterEach(function(done) {
    this.sandbox.restore();
    done();
  });

  context('getting notifications', function() {
    beforeEach(function(done) {
      const privateKey = config.get('authentication.privateKey');
      this.tokenData = {
        user_id: this.user.id,
        expiresIn: 360,
      };
      this.token = Jwt.sign(this.tokenData, privateKey);
      done();
    });

    it('should get a user\'s notifications', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/notifications',
        credentials: { user_id: 'user1', password: 'password1' },
        headers: {
          authorization: `Token: ${this.token}`,
        },
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  context('removing notifications', function() {
    it('should remove a notification', function(done) {
      server.select('api').inject({
        method: 'DELETE',
        url: '/notification/notification1',
        credentials: { user_id: 'user1', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        models.Notification.findById('notification1').then(result => {
          expect(result).to.be.a('null');
          done();
        });
      });
    });
  });

  context('updating notifications', function() {
    beforeEach(function(done) {
      this.payload = {
        data: 'new notification data',
      };
      done();
    });

    it('should return 400 if missing params', function(done) {
      server.select('api').inject({
        method: 'PUT',
        url: '/notification/notification1',
        credentials: { user_id: 'user1', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should update a notification', function(done) {
      server.select('api').inject({
        method: 'PUT',
        url: '/notification/notification1',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        models.Notification.findById('notification1').then(result => {
          expect(result).to.not.be.a('null');
          expect(result.data).to.be.equal(this.payload.data);
          done();
        });
      });
    });
  });
});
