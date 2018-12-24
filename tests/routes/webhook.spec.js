/* global sinon, expect, beforeEach, afterEach, it, describe, context */
import events from 'events';
import request from 'request';
import constants from '../../server/constants';
import server from '../../server/server';
import models from '../../server/data/models/modelManager';
import newsfeed from '../../server/controller/newsfeedController';
import templates from '../../server/templates';

describe('Webhook', function() {
  beforeEach(function(done) {
    this.sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function(done) {
    this.sandbox.restore();
    done();
  });

  context('github webhook setup', function() {
    beforeEach(function(done) {
      this.payload = {
        owner: 'owner1',
        name: 'name1',
        token: 'token1',
      };
      done();
    });


    it('should create github webhook', function(done) {
      // Mock request.post().form().on('response', () => {})
      // Kind of a hacky approach. Consider using something like nock.
      const requestPostStub = this.sandbox.stub(request, 'post');
      const formMock = this.sandbox.mock();
      const emitter = new events.EventEmitter();
      setTimeout(() => emitter.emit('response'), 200);
      formMock.returns(emitter)
        .once();
      requestPostStub.returns({ form: formMock });

      server.select('api').inject({
        method: 'POST',
        url: '/webhook/github/setup',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        formMock.verify();
        const calledArgs = JSON.parse(formMock.args[0][0]);
        expect(calledArgs.events).to.deep.equal(['create', 'push', 'issues']);
        expect(calledArgs.name).to.equal('web');
        expect(calledArgs.active).to.equal(true);
        done();
      });
    });
  });

  context('github webhook', function() {
    beforeEach(function(done) {
      this.newsfeedMock = this.sandbox.mock(newsfeed);

      this.githubLogin = 'github_login1';
      this.repoName = 'repo_name1';
      this.repoOwner = 'owner1';

      this.payload = {
        sender: { login: this.githubLogin },
        repository: {
          name: this.repoName,
          owner: { name: this.repoOwner },
        },
        commits: ['commit1'],
        ref: '123456',
        ref_type: 'branch',
        release: 'release1',
      };

      models.User
        .create({
          id: 'user1',
          email: 'email1',
          github_login: this.githubLogin,
        })
        .then((newUser) => {
          this.user = newUser;
          return models.Project.create({
            id: 'project1',
            github_repo_owner: this.repoOwner,
            github_repo_name: this.repoName,
          });
        })
        .then((newProject) => {
          this.project = newProject;
          return this.user.addProject(newProject, { role: constants.ROLE_CREATOR });
        })
        .then(() => {
          this.project.addUser(this.user);
          done();
        });
    });


    it('should handle a push event', function(done) {
      this.newsfeedMock
        .expects('updateNewsfeed')
        .once()
        .withArgs({ commitSize: 1, user_id: 'user1' }, templates.GITHUB_PUSH);
      server.select('api').inject({
        method: 'POST',
        url: '/webhook/github',
        credentials: { user_id: 'user1', password: 'password1' },
        headers: {
          'x-github-event': 'push',
        },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        // Event handlers are executed async, so we have to wait a while before doing assertions.
        setTimeout(() => {
          this.newsfeedMock.verify();
          done();
        }, 200);
      });
    });

    it('should handle a create event', function(done) {
      this.newsfeedMock
        .expects('updateNewsfeed')
        .once()
        .withArgs(
          { ref: this.payload.ref, ref_type: this.payload.ref_type, user_id: 'user1' },
          templates.GITHUB_CREATE
        );
      server.select('api').inject({
        method: 'POST',
        url: '/webhook/github',
        credentials: { user_id: 'user1', password: 'password1' },
        headers: {
          'x-github-event': 'create',
        },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        // Event handlers are executed async, so we have to wait a while before doing assertions.
        setTimeout(() => {
          this.newsfeedMock.verify();
          done();
        }, 200);
      });
    });
  });
});
