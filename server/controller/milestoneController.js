var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var moment = require('moment');
var accessControl = require('./accessControl');
var socket = require('./socket/handlers');
var helper = require('../utils/helper');
var config = require('config');
var camelcaseKeys = require('camelcase-keys');
var github = require('./githubController')
var analytics = require('collab-analytics')(config.database, config.logging_database);

module.exports = {
    createMilestone: {
        handler: createMilestone,
        payload: {
            parse: true
        }
    },
    updateMilestone: {
        handler: updateMilestone,
        payload: {
            parse: true
        }
    },
    removeMilestone: {
        handler: deleteMilestone,
        payload: {
            parse: true
        }
    }
};

function updateMilestone(request, reply) {
    var milestone_id = request.params.milestone_id;
    var token = request.payload.github_token
    var user_id = request.auth.credentials.user_id
    var milestone = {}
    if (request.payload.content) {
        milestone.content = request.payload.content
    }
    if ('deadline' in request.payload) {
        milestone.deadline = request.payload.deadline ? request.payload.deadline : null // convert empty string to null
    }

    storage.findProjectOfMilestone(milestone_id).then(function(result) {
        if (!result) {
            reply(Boom.badRequest(format(constants.MILESTONE_NOT_EXIST, milestone_id)));
            return
        }
        var project = result.project
        var github_num = result.milestone.github_number

        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.updateMilestone(milestone, milestone_id).then(function(m) {
                analytics.milestone.logMilestoneActivity(
                    analytics.milestone.constants.ACTIVITY_UPDATE,
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    camelcaseKeys(m.toJSON())
                )

                socket.sendMessageToProject(project.id, 'update_milestone', {
                    milestone: milestone, sender: user_id, milestone_id: milestone_id
                })
                reply(milestone);

                if (!token) return

                // Add the same milestone to github milestones
                var owner = project.github_repo_owner
                var repo = project.github_repo_name
                var payload = {title: request.payload.content}
                // make sure due_on is null and not empty string
                if ('deadline' in request.payload && !request.payload.deadline){
                    payload.due_on = null
                } else if ('deadline' in request.payload) {
                    payload.due_on = request.payload.deadline
                }
                github.updateGithubMilestone(owner, repo, token, github_num, payload).then(function(){}, function (err) {
                    console.log(err)
                })

            }, function(error) {
                reply(Boom.internal(error));
            });
        })
    })
}

function createMilestone(request, reply) {
    var milestone = {
        content: request.payload.content,
        deadline: request.payload.deadline ? request.payload.deadline : null, // convert empty string to null
        project_id: request.payload.project_id
    };

    var user_id = request.auth.credentials.user_id

    storage.getProjectsOfUser(user_id).then(function(projects) {
        var currentProject = null
        var matchingProjects = projects.filter(function (project) {
            return project.id === request.payload.project_id
        })
        if (matchingProjects.length !== 1) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return
        } else {
            currentProject = matchingProjects[0]
        }

        storage.createMilestone(milestone).then(function(m) {
            analytics.milestone.logMilestoneActivity(
                analytics.milestone.constants.ACTIVITY_CREATE,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                camelcaseKeys(m.toJSON())
            )

            socket.sendMessageToProject(request.payload.project_id, 'new_milestone', {
                milestone: m, sender: user_id
            })
            reply(m);
            if (!request.payload.github_token) return

            // Add the same milestone to github milestones
            var owner = currentProject.github_repo_owner
            var repo = currentProject.github_repo_name
            var payload = {
                title: milestone.content,
                due_on: milestone.deadline
            }
            github.createGithubMilestone(m.id, payload, owner, repo, request.payload.github_token)

        }, function(error) {
            reply(Boom.internal(error));
        }); //storage.createMilestone

    }) // getProjectsOfUser
}

function deleteMilestone(request, reply) {
    var milestone_id = request.params.milestone_id;
    var token = request.payload.github_token
    var user_id = request.auth.credentials.user_id

    storage.findProjectOfMilestone(milestone_id).then(function(result) {
        if (!result) {
            reply(Boom.badRequest(format(constants.MILESTONE_NOT_EXIST, milestone_id)));
            return
        }

        var project = result.project
        var milestone = result.milestone

        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }

            storage.deleteMilestone(milestone_id).then(function() {
                analytics.milestone.logMilestoneActivity(
                  analytics.milestone.constants.ACTIVITY_DELETE,
                  moment().format('YYYY-MM-DD HH:mm:ss'),
                  { projectId: project.id, id: milestone_id}
                )

                reply({status: constants.STATUS_OK});
                socket.sendMessageToProject(project.id, 'delete_milestone', {
                    milestone_id: milestone_id, sender: user_id
                })
                if (!token) return
                github.deleteGithubMilestone(project.github_repo_owner, project.github_repo_name, token, milestone.github_number)
            });
        })
    })
}
