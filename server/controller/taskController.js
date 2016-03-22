var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var socket = require('./socket/handlers');
var helper = require('../utils/helper');
var config = require('config');
var Jwt = require('jsonwebtoken');
var Promise = require("bluebird");
var github = require('./githubController')
var accessControl = require('./accessControl')
var secret_key = config.get('authentication.privateKey');

module.exports = {
    createTask: {
        handler: createTask,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                content: Joi.string().required(),
                project_id: Joi.string().required(),
                completed_on: Joi.string().isoDate().default(null),
                milestone_id: Joi.default(null),
                assignee_id: Joi.default(null),
                github_token: Joi.default('')
            }
        }
    },
    getTask: {
        handler: getTask
    },

    updateTask: {
        handler: updateTask,
        payload: {
            parse: true
        }
    },
    markComplete: {
        handler: markTaskAsDone,
        payload: {
            parse: true
        }
    },
    removeTask: {
        handler: deleteTask,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                project_id: Joi.string().required()
            }
        }
    }
};

function updateTask(request, reply) {
    var task_id = request.params.task_id;
    var token = request.payload.github_token

    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.findProjectOfTask(task_id).then(function(result) {
            if (!result) {
                reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
                return
            }
            var project = result.project
            var github_num = result.task.github_number

            storage.updateTask(request.payload, task_id).then(function() {
                reply({status: constants.STATUS_OK});
                socket.sendMessageToProject(project.id, 'update_task', {
                    task_id: task_id, sender: decoded.user_id
                })
                if (!token) return
                // Add the same task to github issues
                var owner = project.github_repo_owner
                var repo = project.github_repo_name

                if (request.payload.assignee_id) {
                    storage.findGithubLogin(request.payload.assignee_id).then(function(login) {
                        var payload = {title: request.payload.content, assignee: login}
                        github.updateGithubIssue(owner, repo, token, github_num, payload)
                    })
                } else {
                    var payload = {title: request.payload.content}
                    github.updateGithubIssue(owner, repo, token, github_num, payload)
                }
            })
        })
    })
}

function getTask(request, reply) {
    var task_id = request.params.task_id;
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
        } else {
            storage.getTask(task_id).then(function(task) {
                reply(task);
            });
        }
    });
}

function createTask(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.getProjectsOfUser(decoded.user_id).then(function(projects) {
            var currentProject = null
            var matchingProjects = projects.filter(function(project) {
                return project.id === request.payload.project_id
            })
            if (err || matchingProjects.length !== 1) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return
            } else {
                currentProject = matchingProjects[0]
            }

            storage.createTask(request.payload).then(function(newTask) {
                socket.sendMessageToProject(request.payload.project_id, 'new_task', {
                    task: newTask, sender: decoded.user_id
                })

                reply(newTask);
                if (!request.payload.github_token) return
                // Add the same task to github issues
                var owner = currentProject.github_repo_owner
                var repo = currentProject.github_repo_name
                var promises = []
                if (request.payload.assignee_id) {
                    promises.push(storage.findGithubLogin(request.payload.assignee_id))
                }
                if (request.payload.milestone_id) {
                    promises.push(storage.findGithubMilestoneNumber(request.payload.milestone_id))
                }
                var issue = {
                    title: request.payload.content
                }
                if (request.payload.milestone_id || request.payload.assignee_id) {
                    Promise.all(promises).then(function(a) {
                        if (request.payload.milestone_id && request.payload.assignee_id) {
                            issue.assignee = a[0]
                            issue.milestone = a[1]
                        } else if (request.payload.milestone_id) {
                            issue.milestone = a[0]
                        } else if (request.payload.assignee_id) {
                            issue.assignee = a[0]
                        }
                        github.createGithubIssue(newTask.id, issue, owner, repo, request.payload.github_token).then(function() {},
                            function(err) {
                            console.log(err)
                        })
                    }, function(err) {
                        console.log(err)
                    })
                } else {
                    github.createGithubIssue(newTask.id, issue, owner, repo, request.payload.github_token)
                }

            }, function(error) {
                reply(Boom.badRequest(error));
            }); //storage.createTask

        });
    });
}

function markTaskAsDone(request, reply) {
    var project_id = request.payload.project_id
    var task_id = request.payload.task_id;
    var token = request.payload.github_token

    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.getProjectsOfUser(decoded.user_id).then(function(projects) {
            var currentProject = null
            var matchingProjects = projects.filter(function (project) {
                return project.id === request.payload.project_id
            })
            if (err || matchingProjects.length !== 1) {
                reply(Boom.forbidden(constants.FORBIDDEN));
            } else {
                currentProject = matchingProjects[0]
            }

            storage.doesTaskExist(task_id).then(function (exists) {
                if (!exists) {
                    reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
                } else {
                    storage.markDone(task_id).then(function () {
                        socket.sendMessageToProject(project_id, 'mark_done', {
                            task_id: task_id, sender: decoded.user_id
                        })
                        reply({status: constants.STATUS_OK});
                        if (!request.payload.github_token) return
                        // Add the same task to github issues
                        var owner = currentProject.github_repo_owner
                        var repo = currentProject.github_repo_name

                        storage.findGithubIssueNumber(task_id).then(function(number) {
                            github.updateGithubIssue(owner, repo, token, number, {state: 'closed'})
                        }, function(err){
                            console.log(err)
                        })
                    });
                }
            });
        })
    })
}

function deleteTask(request, reply) { //todo: don't support deleteTask since github does not allow it too
    var task_id = request.params.task_id;
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.doesTaskExist(task_id).then(function(exists) {
            if (!exists) {
                reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
            } else {
                storage.deleteTask(task_id).then(function() {
                    socket.sendMessageToProject(request.payload.project_id, 'delete_task', {
                        task_id: task_id, sender: decoded.user_id
                    })
                    reply({
                        status: constants.STATUS_OK
                    });
                });
            }
        });
    })
}