/* global sinon, expect, beforeEach, afterEach, it, describe */
import github from '../server/controller/githubController';
import socket from '../server/controller/socket/handlers';
import constants from '../server/constants';
import server from '../server/server';
import models from '../server/data/models/modelManager';

describe('Task', function() {
  beforeEach(function(done) {
    this.socketMock = sinon.mock(socket);
    this.githubMock = sinon.mock(github);
    let user = null;

    models.User
      .create({ id: 'user1' })
      .then((newUser) => {
        user = newUser;
        return models.Project.create({
          id: 'project1',
        });
      })
      .then((newProject) => user.addProject(newProject, { role: constants.ROLE_CREATOR }))
      .then(() => models.Milestone.create({
        id: 'milestone1',
        project_id: 'project1',
      }))
      .then(() => models.Task.create({
        id: 'task1',
        project_id: 'project1',
        milestone_id: 'milestone1',
      }))
      .then(() => {
        done();
      });
  });

  afterEach(function(done) {
    this.socketMock.restore();
    this.githubMock.restore();
    done();
  });

  describe('Get Tasks', function() {
    it('should return 400 if task does not exist', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/task/task999',
        credentials: { user_id: 'user1', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return 403 if user is not authorized to view task\'s project', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/task/task1',
        credentials: { user_id: 'user2', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });

    it('should get task', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/task/task1',
        credentials: { user_id: 'user1', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.be.a('object');
        expect(res.result.id).to.equal('task1');
        expect(res.result.project_id).to.equal('project1');
        expect(res.result.milestone_id).to.equal('milestone1');
        done();
      });
    });
  });

  describe('Create Task', function() {
    beforeEach(function(done) {
      this.socketMock = sinon.mock(socket);
      this.payload = {
        content: 'task content',
        project_id: 'project1',
      };
      done();
    });

    it('should return 403 if user is not a project member', function(done) {
      this.payload.project_id = 'project2';
      server.select('api').inject({
        method: 'POST',
        url: '/tasks',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });

    it('should return 400 if missing params', function(done) {
      delete this.payload.content;
      server.select('api').inject({
        method: 'POST',
        url: '/tasks',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should create a task without milestone', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/tasks',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        this.socketMock
          .expects('sendMessageToProject')
          .once()
          .withArgs(this.payload.project_id, 'new_task');
        this.githubMock
          .expects('createGithubIssue')
          .once();
        models.Task.findById('task1').then(createdTask => {
          expect(createdTask).to.not.be.a('null');
          done();
        });
      });
    });
  });
});
