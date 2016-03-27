var constants = require('../constants');
var storage = require('../data/storage')
var helper = require('../utils/helper')
var accessControl = require('./accessControl');
var Sequelize = require('sequelize');
var Promise = require("bluebird");
var socket = require('./socket/handlers')
var templates = require('./../templates')

module.exports = {
    getNewsfeed: {
        handler: getNewsfeed
    },
    updateNewsfeed: updateNewsfeed
}

function updateNewsfeed(data, template, projectId) {
    return new Promise(function(resolve, reject) {
        storage.saveNewsfeed(JSON.stringify(data), template, projectId).then(function(newsfeed) {
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