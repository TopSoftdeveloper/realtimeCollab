var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var socket = require('./socket/handlers');
var helper = require('../utils/helper');
var config = require('config');
var Jwt = require('jsonwebtoken');
var GITHUB_ENDPOINT = constants.GITHUB_ENDPOINT
var Promise = require("bluebird");
var req = require("request")

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
        handler: getTasks
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
        },
        validate: {
            payload: {
                task_id: Joi.string().required(),
                project_id: Joi.string().required()
            }
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
    var payload = request.payload
    storage.updateTask(payload, task_id).then(function() {
        reply({
            status: constants.STATUS_OK
        });
    })
}

function getTaskById(task_id, reply) {
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
        } else {
            storage.getTask(task_id).then(function(task) {
                reply({
                    status: constants.STATUS_OK,
                    tasks: [task]
                });
            });
        }
    });
}

function getTasks(request, reply) {
    var task_id = request.params.task_id;
    if (task_id === null) {
        storage.getAllTasks().then(function(tasks) {
            reply({
                status: constants.STATUS_OK,
                tasks: tasks
            })
        });
    } else {
        getTaskById(task_id, reply);
    }
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
                var githubAssignee = null
                var githubMilestone = null
                var owner = currentProject.github_repo_owner
                var repo = currentProject.github_repo_name
                var promises = []

                if (request.payload.assignee_id) {
                    promises.push(new Promise(function(resolve, reject) {
                        storage.findUserById(request.payload.assignee_id).done(function(user) {
                            if (!user) {
                                resolve()
                            }
                            user = JSON.parse(JSON.stringify(user))
                            githubAssignee = user.github_login
                            resolve(user.github_login)
                        })
                    }))
                }

                if (request.payload.milestone_id) {
                    promises.push(new Promise(function(resolve, reject) {
                        storage.getMilestone(task.milestone_id).done(function(milestone) {
                            if (!milestone) {
                                resolve()
                            }
                            milestone = JSON.parse(JSON.stringify(milestone))
                            githubMilestone = milestone.github_number
                            resolve(milestone.github_number)
                        })
                    }))
                }

                if (request.payload.milestone_id || request.payload.assignee_id) {
                    Promise.all(promises).then(function(p) {
                        var issue = {
                            title: request.payload.content,
                            assignee: githubAssignee,
                            milestone: githubMilestone
                        }
                        POSTIssueToGithub(newTask.id, issue, owner, repo, request.payload.github_token)
                    }).catch(function(err) {
                        console.log(err)
                    })
                } else {
                    var issue = {
                        title: request.payload.content,
                        assignee: githubAssignee,
                        milestone: githubMilestone
                    }
                    POSTIssueToGithub(newTask.id, issue, owner, repo, request.payload.github_token)
                }

            }, function(error) {
                reply(Boom.badRequest(error));
            }); //storage.createTask

        });
    });
}


function POSTIssueToGithub(taskId, issue, owner, repo, token) {
    console.log('POSTING')
    console.log(issue)
    var options = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + repo + '/issues',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        }
    }
    options.form = JSON.stringify(issue)
    req.post(options, function(err, res, body) {
        if (err) {
            console.log(err)
            return
        }
        var parsedBody = JSON.parse(body)
        if (parsedBody.id) { // if successful, should return issue id
            storage.updateTask({github_id: parsedBody.id, github_number: parsedBody.number}, taskId)
        } else {
            console.log(parsedBody)
        }
    })
}

function markTaskAsDone(request, reply) {
    var task_id = request.payload.task_id;
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
        } else {
            storage.markDone(task_id).then(function() {               
                Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
                    socket.sendMessageToProject(request.payload.project_id, 'mark_done', {
                        task_id: task_id, sender: decoded.user_id
                    })
                });    
                reply({
                    status: constants.STATUS_OK
                });                               
            });
        }
    });
}

function deleteTask(request, reply) {
    var task_id = request.params.task_id;
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
        } else {
            storage.deleteTask(task_id).then(function() {
                Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
                    socket.sendMessageToProject(request.payload.project_id, 'delete_task', {
                        task_id: task_id, sender: decoded.user_id
                    })
                });    
                reply({
                    status: constants.STATUS_OK
                });                              
            });
        }
    });
}