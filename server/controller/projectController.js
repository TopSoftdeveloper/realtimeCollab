var constants = require('../constants')
var storage = require('../data/storage')
var format = require('string-format')
var Joi = require('joi')
var Boom = require('boom')
var Jwt = require('jsonwebtoken')
var config = require('config')
var helper = require('../utils/helper')
var notifications = require('./notification/notificationController')
var templates = require('./notification/templates')

var _ = require('lodash')

var secret_key = config.get('authentication.privateKey')

module.exports = {
    updateProject: {
        handler: updateProject,
        payload: {
            parse: true
        }
    },
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

    acceptInvitation: {
        handler: acceptInvitation
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

function updateProject(request, reply) {
    var projectId = request.params.project_id
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        var fromUser = decoded.user_id

        storage.getProjectsOfUser(fromUser).then(function(projects) {
            var matchingProjects = projects.filter(function(project) {
                return project.id === projectId
            })

            if (err || matchingProjects.length !== 1) {
                reply(Boom.forbidden(constants.FORBIDDEN));
            } else {
                storage.updateProject(request.payload, projectId).then(function() {
                    reply({status: constants.STATUS_OK})
                }, function(error) {
                    reply(Boom.internal(error));
                })
            }
        });
    });
}

function acceptInvitation(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.joinProject(decoded.user_id, request.params.project_id).then(function() {
            var notifData = {
                user_id: decoded.user_id,
                project_id: request.params.project_id
            }
            notifications.newProjectNotification(notifData, templates.JOINED_PROJECT, request.params.project_id, decoded.user_id)
            reply({status: constants.STATUS_OK})
        })
    })
}

function inviteToProject(request, reply) {
    // User needs to be in current project to invite someone else
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        var fromUser = decoded.user_id

        storage.getProjectsOfUser(fromUser).then(function(projects) {
            var matchingProjects = projects.filter(function(project) {
                return project.id === request.payload.project_id
            })

            if (err || matchingProjects.length !== 1) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.findUserByEmail(request.payload.email).then(function(user) {
                if (user === null) {
                    reply(Boom.badRequest(constants.USER_NOT_FOUND))
                    return
                }

                var toUser = user.id

                storage.inviteToProject(toUser, request.payload.project_id).then(function() {
                    var notifData = {
                        user_id: fromUser,
                        project_id: matchingProjects[0].id
                    }
                    notifications.newUserNotification(notifData, templates.INVITE_TO_PROJECT, toUser)
                    return reply({status: constants.STATUS_OK});

                }, function(err) {
                    if (typeof err !== 'string') {
                        if (err.errors[0].message === constants.DUPLICATE_PRIMARY_KEY) {
                            errorMessage = constants.USER_ALREADY_PRESENT;
                        }
                    }
                    return reply(Boom.badRequest(errorMessage))
                })
            })
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