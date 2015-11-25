var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var config = require('config');
var helper = require('../utils/helper');
var secret_key = config.get('authentication.privateKey');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    getInfo: {
        handler: populate,
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        }
    }
};

function normalize(projectsData) {
    // removes the nested 'user_project' and just retains 'role' attribute
    projectsData.forEach(function(project) {
        project.users.forEach(function(user) {            
            _.assign(user, {'role': user.user_project.role});
            delete user['user_project'];            
        });
    });
    return projectsData;
}

function filterPending(normalizedProjectsData, userId) {
    var projects = [];
    normalizedProjectsData.forEach(function(project) {
        var pending = false;
        project.users.forEach(function(user) {     
            console.log(user.id + ' ' + userId + ' ' +  user.role)
            if (user.id === userId && user.role === constants.ROLE_PENDING) {
                pending = true;
            }       
        });       
        if (!pending) {
            projects.push(project);
        }         
    });
    return projects;
}

function populate(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        if (err || (decoded.user_id !== request.params.user_id)) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.getProjectsOfUser(decoded.user_id).then(function(projects) {
            Promise.map(projects, function(project) {
                return storage.getMilestonesWithTasks(project.id);
            }).then(function(milestones) {
                var projectsData = JSON.parse(JSON.stringify(projects));
                var milestonesData = JSON.parse(JSON.stringify(milestones));
                milestonesData = milestonesData.map(function(arr) {
                    return {milestones: arr};
                });
                var normalized = normalize(projectsData);
                reply({projects:_.merge(filterPending(normalized, decoded.user_id), milestonesData)});
            });
        });

    });
}