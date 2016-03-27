var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var newsfeed = require('../server/controller/newsfeedController')
var templates = require('../server/controller/templates')
var sinon = require('sinon')
var storage = require('../server/data/storage')
var socket = require('../server/controller/socket/handlers')
var Promise = require('bluebird')

describe('Newsfeed', function() {

    it('should save newsfeed post to disk and broadcast to project', function(done) {
        var storageStub = sinon.stub(storage, 'saveNewsfeed');
        var data = {ref_type: 'branch', ref: 'helloworld', user_id: 'NysSbasYe'}
        var template = templates.GITHUB_CREATE
        var projectId = '4yGslGste'
        var newsfeedPost = {
            id: 'newsfeed1',
            data: JSON.stringify(data),
            template: template,
            project_id: projectId,
            updated_at: '2016-03-27 06:22:21',
            created_at: '2016-03-27 06:22:21'
        }
        storageStub.withArgs(JSON.stringify(data), template, projectId)
            .returns(Promise.resolve(newsfeedPost));

        var socketMock = sinon.mock(socket);
        socketMock.expects('sendMessageToProject').once().withExactArgs(projectId, 'newsfeed_post', newsfeedPost)

        newsfeed.updateNewsfeed(data, template, projectId).then(function(res) {
            expect(res).to.deep.equal(newsfeedPost)
            done()
        })
    });
});