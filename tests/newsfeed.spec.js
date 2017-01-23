/* global sinon, expect, beforeEach, afterEach, it, describe */
import newsfeed from '../server/controller/newsfeedController';
import storage from '../server/data/storage';
import templates from '../server/templates';
import socket from '../server/controller/socket/handlers';
import constants from '../server/constants';

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
});
