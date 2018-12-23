/* global sinon, expect, beforeEach, afterEach, it, describe, context */
import github from '../../server/controller/githubController';
import socket from '../../server/controller/socket/handlers';
import constants from '../../server/constants';
import server from '../../server/server';
import models from '../../server/data/models/modelManager';

describe('Task', function() {
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

  context('getting tasks', function() {
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

  describe('creating tasks', function() {
    beforeEach(function(done) {
      this.payload = {
        content: 'task content',
        project_id: 'project1',
        isGithubIssue: 'false',
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

    it('should create a task without github milestone/assignee', function(done) {
      this.socketMock
        .expects('sendMessageToProject')
        .once()
        .withArgs(this.payload.project_id, 'new_task');
      const githubStub = this.sandbox.stub(github, 'createGithubIssue');
      githubStub.returns(Promise.resolve());

      server.select('api').inject({
        method: 'POST',
        url: '/tasks',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        this.socketMock.verify();
        this.githubMock.verify();
        models.Task.findById('task1').then(createdTask => {
          expect(createdTask).to.not.be.a('null');
          // Github issue is created asynchronously from the response,
          // hence we have to wait till a while, even after getting a response.
          setTimeout(() => {
            expect(githubStub.called).to.equal(false);
            done();
          }, 200);
        });
      });
    });
    // Since milestone integration has been removed
    /*
    it('should create a task with github milestone', function(done) {
      this.payload.milestone_id = 'milestone1';
      this.payload.github_token = 'github_token1';
      this.socketMock
        .expects('sendMessageToProject')
        .once()
        .withArgs(this.payload.project_id, 'new_task');
      const githubStub = this.sandbox.stub(github, 'createGithubIssue');
      githubStub.returns(Promise.resolve());

      server.select('api').inject({
        method: 'POST',
        url: '/tasks',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        this.socketMock.verify();
        models.Task.findById('task1').then(createdTask => {
          expect(createdTask).to.not.be.a('null');
          // Github issue is created asynchronously from the response,
          // hence we have to wait till a while, even after getting a response.
          setTimeout(() => {
            expect(githubStub.called).to.equal(true);
            done();
          }, 200);
        });
      });
    });

    it('should create a task with github milestone and assignee', function(done) {
      this.payload.milestone_id = 'milestone1';
      this.payload.assignee_id = 'user1';
      this.payload.github_token = 'github_token1';
      this.socketMock
        .expects('sendMessageToProject')
        .once()
        .withArgs(this.payload.project_id, 'new_task');
      const githubStub = this.sandbox.stub(github, 'createGithubIssue');
      githubStub.returns(Promise.resolve());

      server.select('api').inject({
        method: 'POST',
        url: '/tasks',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        this.socketMock.verify();
        models.Task.findById('task1').then(createdTask => {
          expect(createdTask).to.not.be.a('null');
          // Github issue is created asynchronously from the response,
          // hence we have to wait till a while, even after getting a response.
          setTimeout(() => {
            expect(githubStub.called).to.equal(true);
            done();
          }, 200);
        });
      });
    });*/
  });

  describe('updating tasks', function() {
    beforeEach(function(done) {
      this.payload = {
        content: 'new content',
        project_id: this.task.project_id,
      };
      done();
    });

    it('should return 400 if task does not exist', function(done) {
      server.select('api').inject({
        method: 'PUT',
        url: '/task/task999',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return 403 if user is not authorized', function(done) {
      server.select('api').inject({
        method: 'PUT',
        url: '/task/task1',
        credentials: { user_id: 'user22', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });

    it('should update a task', function(done) {
      server.select('api').inject({
        method: 'PUT',
        url: '/task/task1',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        models.Task.findById('task1').then(fetchedTask => {
          expect(fetchedTask).to.not.be.a('null');
          expect(fetchedTask.content).to.be.equal(this.payload.content);
          done();
        });
      });
    });
  });

  describe('deleting tasks', function() {
    beforeEach(function(done) {
      this.payload = {
        project_id: this.task.project_id,
      };
      done();
    });

    it('should return 400 if task does not exist', function(done) {
      server.select('api').inject({
        method: 'DELETE',
        url: '/task/task999',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return 403 if user is not authorized', function(done) {
      server.select('api').inject({
        method: 'DELETE',
        url: '/task/task1',
        credentials: { user_id: 'user22', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });

    it('should delete a task', function(done) {
      server.select('api').inject({
        method: 'DELETE',
        url: '/task/task1',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        models.Task.findById('task1').then(fetchedTask => {
          expect(fetchedTask).to.be.a('null');
          done();
        });
      });
    });
  });

  describe('marking task as done', function() {
    beforeEach(function(done) {
      this.payload = {
        task_id: this.task.id,
        project_id: this.task.project_id,
        github_token: this.task.github_token,
      };
      done();
    });

    it('should return 400 if task does not exist', function(done) {
      this.payload.task_id = 'task999';
      server.select('api').inject({
        method: 'POST',
        url: '/mark_completed',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return 403 if user is not authorized', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/mark_completed',
        credentials: { user_id: 'user22', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });

    it('should mark a task as done', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/mark_completed',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        models.Task.findById('task1').then(fetchedTask => {
          expect(fetchedTask).to.not.be.a('null');
          expect(fetchedTask.completed_on).to.not.be.a('null');
          done();
        });
      });
    });
  });
});
