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

function filterPending(projects, userId) {
    return projects.filter(function(project) {
        var pending = false;
        project.users.forEach(function(user) {    
            if (user.id === userId && user.user_project.role === constants.ROLE_PENDING) {
                pending = true;
            }       
        });       
        if (!pending) {
            return true;
        }         
    });
}

function populate(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        if (err || (decoded.user_id !== request.params.user_id)) {
            reply(Boom.forbidden(constants.FORBIDDEN))
            return
        }
        storage.getProjectsOfUser(request.params.user_id).then(function(projects) {
            var filteredProjects = filterPending(projects, decoded.user_id);
            Promise.map(filteredProjects, function(project) {
                return storage.getMilestonesWithTasks(project.id);
            }).then(function(milestones) {
                var projectsData = JSON.parse(JSON.stringify(filteredProjects));
                var milestonesData = JSON.parse(JSON.stringify(milestones));
                milestonesData = milestonesData.map(function(arr) {
                    return {milestones: arr};
                });
                reply({projects:_.merge(normalize(projectsData), milestonesData)});
            });
        });
    })
}