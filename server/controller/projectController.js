var constants = require('../constants')
var config = require('config')
var storage = require('../data/storage')
var format = require('string-format')
var Joi = require('joi')
var Boom = require('boom')
var helper = require('../utils/helper')
var notifications = require('./notificationController')
var templates = require('./../templates')
var accessControl = require('./accessControl');
var _ = require('lodash')
var socket = require('./socket/handlers');
var analytics = require('collab-analytics')(config.database, config.logging_database);

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

    declineInvitation: {
        handler: declineInvitation
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
    var user_id = request.auth.credentials.user_id
    accessControl.isUserPartOfProject(user_id, projectId).then(function (isPartOf) {
        if (!isPartOf) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.updateProject(request.payload, projectId).then(function() {
            if(request.payload.root_folder !== undefined && request.payload.root_folder !== null) {
                storage.findUserById(user_id).then(function (user) {
                    analytics.drive.pullDrive(config('google'), projectId, request.payload.root_folder, user.google_refresh_token)
                    .then(function() {
                        analytics.drive.pullRevision(config('google', projectId, user.google_refresh_token))
                    })
                })
            }
            reply({status: constants.STATUS_OK})
            socket.sendMessageToProject(projectId, 'update_project', {
                project_id: projectId, sender: user_id, project: request.payload
            })

        }, function(error) {
            reply(Boom.internal(error));
        })
    })
}

function acceptInvitation(request, reply) {
    var user_id = request.auth.credentials.user_id
    var project_id = request.params.project_id
    accessControl.isUserPartOfProject(user_id, project_id).then(function (isPartOf) {
        if (!isPartOf) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.joinProject(user_id, project_id).then(function() {
            var notifData = {
                user_id: user_id,
                project_id: project_id
            }
            notifications.newProjectNotification(notifData, templates.JOINED_PROJECT, project_id, user_id)
            reply({status: constants.STATUS_OK})
        })
    })
}

function declineInvitation(request, reply) {
    var user_id = request.auth.credentials.user_id
    var project_id = request.params.project_id
    accessControl.isUserPartOfProject(user_id, project_id).then(function (isPartOf) {
        if (!isPartOf) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.removeUserProject(user_id, project_id).then(function() {
            var notifData = {
                user_id: user_id,
                project_id: project_id
            }
            notifications.newProjectNotification(notifData, templates.DECLINED_PROJECT, project_id, user_id)
            reply({status: constants.STATUS_OK})
        })
    })
}


function inviteToProject(request, reply) {
    var fromUser = request.auth.credentials.user_id

    // User needs to be in current project to invite someone else
    storage.getProjectsOfUser(fromUser).then(function(projects) {
        var matchingProjects = projects.filter(function(project) {
            return project.id === request.payload.project_id
        })

        if (matchingProjects.length !== 1) {
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
}

function getProjects(request, reply) {
    var user_id = request.auth.credentials.user_id
    storage.getProjectsOfUser(user_id).then(function(projects) {
        reply({user_id: user_id, projects: projects});
    });
}

function getProject(request, reply) {
    var user_id = request.auth.credentials.user_id
    accessControl.isUserPartOfProject(user_id, request.params.project_id).then(function(isPartOf) {
        if (!isPartOf) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.getTasksAndMilestones(request.params.project_id).then(function(tasks) {
            reply({
                status: constants.STATUS_OK,
                tasks: tasks
            })
        });
    });
}

function createProject(request, reply) {
    var user_id = request.auth.credentials.user_id
    storage.createProject(request.payload.content).then(function(project) {
        storage.addProjectToUser(user_id, project).then(function(obj) {
            reply({project_id: project.id});
        }, function(err) {
            reply(Boom.forbidden(constants.FORBIDDEN));
        });
    }, function(error) {
        reply(Boom.internal(error));
    });
}
