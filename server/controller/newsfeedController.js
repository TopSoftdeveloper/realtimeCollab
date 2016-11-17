var constants = require('../constants');
var storage = require('../data/storage')
var helper = require('../utils/helper')
var accessControl = require('./accessControl');
var Sequelize = require('sequelize');
var Promise = require("bluebird");
var socket = require('./socket/handlers')
var templates = require('./../templates')
var Boom = require('boom');

module.exports = {
    getNewsfeed: {
        handler: getNewsfeed
    },
    createPost: {
        handler: createPost,
        payload: {
            parse: true
        }
    },
    updateNewsfeed: updateNewsfeed
}

function createPost(request, reply) {
    var userId = request.auth.credentials.user_id
    var projectId = request.params.project_id

    accessControl.isUserPartOfProject(userId, projectId).then(function (isPartOf) {
        if (!isPartOf) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        updateNewsfeed(JSON.parse(request.payload.data), request.payload.template, projectId,
            request.payload.source, new Date().toISOString()).then(function() {
            reply({status: 'OK'})
        }, function(err) {
            reply(Boom.badRequest())
        })
    })
}

function updateNewsfeed(data, template, projectId, source, timestamp) {
    return new Promise(function(resolve, reject) {
        storage.saveNewsfeed(JSON.stringify(data), template, projectId, source, timestamp).then(function(newsfeed) {
            socket.sendMessageToProject(projectId, 'newsfeed_post', newsfeed)
            resolve(newsfeed)
        }.bind(this), function(err) {
            console.error(err)
            reject(err)
        })
    })
}

function getNewsfeed(request, reply) {
    var userId = request.auth.credentials.user_id
    var promises = []

    storage.getProjectsOfUser(userId).then(function(projects) {
        projects.forEach(function(project) {
            promises.push(storage.getNewsfeed(project.id, 20))
        })
        Sequelize.Promise.all(promises).done(function(res) {
            var concatArray = []
            res.forEach(function(posts) {
                concatArray = concatArray.concat(posts)
            })
            reply({newsfeed: concatArray})
        })
    }, function(err) {
        reply({error: err})
    })
}
