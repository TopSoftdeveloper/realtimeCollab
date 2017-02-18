/* global sinon, expect, beforeEach, afterEach, it, describe, context */
import github from '../../server/controller/githubController';
import socket from '../../server/controller/socket/handlers';
import constants from '../../server/constants';
import server from '../../server/server';
import models from '../../server/data/models/modelManager';

describe('User', function() {
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

  context('getting users', function() {
    // NOTE: The route is weird in that the :user_id parameter isn't used.
    // The user to get is actually taken from the credentials object.
    it('should return 400 if user does not exist', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/user/populate/user2',
        credentials: { user_id: 'user2', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should get a user\'s projects', function(done) {
      server.select('api').inject({
        method: 'GET',
        url: '/user/populate/user1',
        credentials: { user_id: 'user1', password: 'password1' },
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.result.projects).to.be.a('array');
        expect(res.result.projects.length).to.equal(1);
        expect(res.result.projects[0].users.length).to.equal(1);
        expect(res.result.projects[0].milestones.length).to.equal(1);
        expect(res.result.projects[0].tasks.length).to.equal(1);
        done();
      });
    });
  });
});
