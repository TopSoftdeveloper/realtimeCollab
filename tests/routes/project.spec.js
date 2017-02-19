/* global sinon, expect, beforeEach, afterEach, it, describe, context */
import templates from '../../server/templates';
import github from '../../server/controller/githubController';
import notifications from '../../server/controller/notificationController';
import socket from '../../server/controller/socket/handlers';
import constants from '../../server/constants';
import server from '../../server/server';
import models from '../../server/data/models/modelManager';

describe('Project', function() {
  beforeEach(function(done) {
    this.sandbox = sinon.sandbox.create();
    this.socketMock = this.sandbox.mock(socket);
    this.githubMock = this.sandbox.mock(github);

    models.User
      .create({
        id: 'user1',
        email: 'email1',
        github_login: 'github_login1',
      })
      .then((newUser) => {
        this.user = newUser;
        return models.Project.create({
          id: 'project1',
          github_repo_owner: 'user1',
          github_repo_name: 'repo_name',
        });
      })
      .then((newProject) => {
        this.project = newProject;
        return this.user.addProject(newProject, { role: constants.ROLE_CREATOR });
      })
      .then(() => this.project.addUser(this.user))
      .then(() => models.Milestone.create({
        id: 'milestone1',
        project_id: 'project1',
        github_number: 1,
      }))
      .then((newMilestone) => {
        this.milestone = newMilestone;
        return models.Task.create({
          id: 'task1',
          project_id: 'project1',
          milestone_id: 'milestone1',
          github_token: 'github_token1',
        });
      })
      .then((newTask) => {
        this.task = newTask;
        done();
      });
  });

  afterEach(function(done) {
    this.sandbox.restore();
    done();
  });

  context('getting a single project', function() {
    it('should return 403 is user is not authorized', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/project/project1',
        credentials: { user_id: 'user2', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });

    it('should get a single project and its tasks', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/project/project1',
        credentials: { user_id: 'user1', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.result.tasks).to.be.a('array');
        expect(res.result.tasks.length).to.equal(1);
        expect(res.result.tasks[0].id).to.equal(this.task.id);
        done();
      });
    });
  });

  context('creating projects', function() {
    it('should return 400 if missing params', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/projects',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify({}),
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should create a project', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/projects',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify({ content: 'project content' }),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.have.any.keys('project_id');
        const newProjectId = res.result.project_id;
        models.Project.findById(newProjectId).then((result) => {
          expect(result).to.not.be.a('null');
          done();
        });
      });
    });
  });

  context('inviting user to project', function() {
    beforeEach(function(done) {
      this.notificationsMock = this.sandbox.mock(notifications);
      this.invitedEmail = 'invited@example.com';
      this.payload = {
        project_id: this.project.id,
        email: this.invitedEmail,
      };

      models.User
        .create({
          id: 'user2',
          email: this.invitedEmail,
          github_login: 'github_login2',
        })
        .then((newUser) => {
          this.user2 = newUser;
          done();
        });
    });

    it('should return 400 if invalid params', function(done) {
      delete this.payload.project_id;
      server.select('api').inject({
        method: 'POST',
        url: '/invite_to_project',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return 403 if user is not part of project', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/invite_to_project',
        credentials: { user_id: 'user2', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });

    it('should return 400 if invited user does not exist', function(done) {
      this.payload.email = 'nonexistent@example.com';
      server.select('api').inject({
        method: 'POST',
        url: '/invite_to_project',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should invite a user to the project', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/invite_to_project',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        const notificationData = {
          user_id: 'user1',
          project_id: this.project.id,
        };
        this.notificationsMock.expects('newUserNotification')
          .withExactArgs(
            notificationData, templates.INVITE_TO_PROJECT, this.user2.id
          );
        models.UserProject.findOne({
          where: {
            user_id: this.user2.id,
            project_id: this.project.id,
            role: constants.ROLE_PENDING,
          },
        }).then((result) => {
          expect(result).to.not.be.a('null');
          done();
        });
      });
    });
  });
});
