/* global sinon, expect, beforeEach, afterEach, it, describe */
import newsfeed from '../server/controller/newsfeedController';
import storage from '../server/data/storage';
import templates from '../server/templates';
import socket from '../server/controller/socket/handlers';
import constants from '../server/constants';
import server from '../server/server';

describe('Newsfeed', () => {
  it('should save newsfeed post to disk and broadcast to project', (done) => {
    const storageStub = sinon.stub(storage, 'saveNewsfeed');
    const data = { ref_type: 'branch', ref: 'helloworld', user_id: 'NysSbasYe' };
    const template = templates.GITHUB_CREATE;
    const projectId = '4yGslGste';
    const newsfeedPost = {
      id: 'newsfeed1',
      data: JSON.stringify(data),
      template,
      project_id: projectId,
      updated_at: '2016-03-27 06:22:21',
      created_at: '2016-03-27 06:22:21',
    };
    storageStub.withArgs(JSON.stringify(data), template, projectId)
      .returns(Promise.resolve(newsfeedPost));

    const socketMock = sinon.mock(socket);
    socketMock
      .expects('sendMessageToProject')
      .once()
      .withExactArgs(projectId, 'newsfeed_post', newsfeedPost);

    newsfeed.updateNewsfeed(data, template, projectId, constants.GITHUB)
      .then(res => {
        expect(res).to.deep.equal(newsfeedPost);
        done();
      });
  });

  it('should get newsfeed posts', (done) => {
    const storageGetProjectsOfUser = sinon.stub(storage, 'getProjectsOfUser');
    const storageGetNewsfeed = sinon.stub(storage, 'getNewsfeed');
    const data = { ref_type: 'branch', ref: 'helloworld', user_id: 'NysSbasYe' };
    const userId = 'user1';
    const projectId = 'project1';
    const projects = [{ id: projectId }];
    const newsfeedPost = {
      id: 'newsfeed1',
      data: JSON.stringify(data),
      template: templates.GITHUB_CREATE,
      project_id: projectId,
      updated_at: '2016-03-27 06:22:21',
      created_at: '2016-03-27 06:22:21',
    };
    storageGetProjectsOfUser.withArgs(userId).returns(Promise.resolve(projects));
    storageGetNewsfeed.withArgs(projectId, 20).returns(Promise.resolve(newsfeedPost));

    server.select('api').inject({
      method: 'GET',
      url: '/newsfeed',
      credentials: { user_id: 'user1', password: 'password1' },
    }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.be.a('object');
      expect(res.result.newsfeed.length).to.equal(1);
      done();
    });
  });
});
