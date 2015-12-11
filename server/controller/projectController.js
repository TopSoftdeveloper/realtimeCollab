var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var config = require('config');
var helper = require('../utils/helper');
var _ = require('lodash');

var secret_key = config.get('authentication.privateKey');

module.exports = {
    createProject: {
        handler: createProject,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                content: Joi.string().required()
            }
        }
    },
    getProjects: {
        handler: getProjects,
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        }
    },
    getProject: {
        handler: getProject
    },
    inviteToProject: {
        handler: inviteToProject,
        validate: {
            payload: {
                project_id: Joi.string().required(),
                email: Joi.string().email().required()
            }
        }
    }
};

function inviteToProject(request, reply) {
    // User needs to be in current project to invite someone else
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.getProjectsOfUser(decoded.user_id).then(function(projects) {
            var isProjectPresent = _.findIndex(projects, function(project) {
                return project.id === request.payload.project_id;
            });

            if (err || isProjectPresent < 0) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }

            storage.inviteToProject(request.payload.email, request.payload.project_id).then(function() {
                return reply({status: constants.STATUS_OK});
            }, function(err) {  
                var errorMessage = err;
                if (typeof err !== 'string') {
                    if (err.errors[0].message === constants.DUPLICATE_PRIMARY_KEY) {
                        errorMessage = constants.USER_ALREADY_PRESENT;
                    }
                }    
                return reply(Boom.badRequest(errorMessage));          
            });            
        });
    });    
}

function getProjects(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        if (err) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.getProjectsOfUser(decoded.user_id).then(function(projects) {
            reply({user_id: decoded.user_id, projects: projects});
        });
    });
}

function getProject(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        accessControl.isUserPartOfProject(decoded.user_id, request.params.project_id).then(function(isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.getMilestonesWithTasks(request.params.project_id).then(function(milestones) {
                reply({
                    status: constants.STATUS_OK,
                    milestones: milestones
                })
            });
        });
    });
}

function createProject(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        if (err) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }       
        storage.createProject(request.payload.content).then(function(project) {
            storage.addProjectToUser(decoded.user_id, project).then(function(obj) {
                reply({project_id: project.id});
            }, function(err) {
                reply(Boom.forbidden(constants.FORBIDDEN));
            });
        }, function(error) {
            reply(Boom.internal(error));
        });
    });
}