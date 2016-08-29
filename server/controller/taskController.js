var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var socket = require('./socket/handlers');
var moment = require('moment');
var helper = require('../utils/helper');
var config = require('config');
var Promise = require("bluebird");
var github = require('./githubController');
var accessControl = require('./accessControl')(config.logging_database);
var analytics = require('collab-analytics');

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
    var user_id = request.auth.credentials.user_id
    request.payload.completed_on = request.payload.completed_on ? request.payload.completed_on : null // convert empty string to null

    storage.findProjectOfTask(task_id).then(function(result) {
        if (!result) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
            return
        }
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            var project = result.project
            var github_num = result.task.github_number

            storage.updateTask(request.payload, task_id).then(function() {
                analytics.task.logTaskActivity({
                  activity: 'U',
                  date: moment().format('YYYY-MM-DD HH:mm:ss'),
                  userId: user_id,
                  projectId: project.id,
                  taskId: task_id
                })

                reply({status: constants.STATUS_OK});

                socket.sendMessageToProject(project.id, 'update_task', {
                    task: request.payload, sender: user_id, task_id: task_id
                })
                if (!token) return
                // Add the same task to github issues
                var owner = project.github_repo_owner
                var repo = project.github_repo_name
                var payload = {title: request.payload.content}

                if (request.payload.completed_on === null) {
                    payload.state = 'open'
                }

                if (request.payload.assignee_id) {
                    storage.findGithubLogin(request.payload.assignee_id).then(function(login) {
                        payload.assignee = login
                        github.updateGithubIssue(owner, repo, token, github_num, payload)
                        analytics.task.logTaskActivity({
                          activity: 'A',
                          date: moment().format('YYYY-MM-DD HH:mm:ss'),
                          userId: user_id,
                          projectId: project.id,
                          taskId: task_id
                        })
                    })
                } else {
                    github.updateGithubIssue(owner, repo, token, github_num, payload)
                }
            })
        })
    })
}

function getTask(request, reply) {
    var task_id = request.params.task_id;
    var user_id = request.auth.credentials.user_id

    storage.findProjectOfTask(task_id).then(function(result) {
        if (!result) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
            return
        }
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.getTask(task_id).then(function(task) {
                reply(task);
            });
        })
    })
}

function createTask(request, reply) {
    var user_id = request.auth.credentials.user_id
    var projectId = request.payload.project_id
    accessControl.isUserPartOfProject(user_id, projectId).then(function (isPartOf) {
        if (!isPartOf) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }

        storage.createTask(request.payload).then(function(newTask) {
            socket.sendMessageToProject(request.payload.project_id, 'new_task', {
                task: newTask, sender: user_id
            })

            analytics.task.logTaskActivity({
              activity: 'C',
              date: moment().format('YYYY-MM-DD HH:mm:ss'),
              userId: request.auth.credentials.user_id,
              projectId: request.payload.project_id,
              taskId: request.payload.id
            })

            if(request.payload.assignee_id) {
              analytics.task.logTaskActivity({
                activity: 'A',
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                userId: request.payload.assignee_id,
                projectId: request.payload.project_id,
                taskId: request.payload.id
              })
            }

            reply(newTask);
            if (!request.payload.github_token) return

            storage.findProjectOfTask(newTask.id).then(function(result) {
                var project = result.project
                // Add the same task to github issues
                var owner = project.github_repo_owner
                var repo = project.github_repo_name
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
            })

        }, function(error) {
            reply(Boom.badRequest(error));
        }); //storage.createTask
    })
}

function markTaskAsDone(request, reply) {
    var project_id = request.payload.project_id
    var task_id = request.payload.task_id;
    var token = request.payload.github_token
    var user_id = request.auth.credentials.user_id

    storage.findProjectOfTask(task_id).then(function(result) {
        if (!result) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
            return
        }
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.markDone(task_id).then(function () {
                analytics.task.logTaskActivity({
                  activity: 'D',
                  date: moment().format('YYYY-MM-DD HH:mm:ss'),
                  userId: user_id,
                  projectId: project_id,
                  taskId: task_id
                })
                socket.sendMessageToProject(project_id, 'mark_done', {
                    task_id: task_id, sender: user_id
                })
                reply({status: constants.STATUS_OK});
                if (!request.payload.github_token) return
                // Add the same task to github issues
                var owner = project.github_repo_owner
                var repo = project.github_repo_name

                storage.findGithubIssueNumber(task_id).then(function(number) {
                    github.updateGithubIssue(owner, repo, token, number, {state: 'closed'})
                }, function(err){
                    console.log(err)
                })
            });
        })
    })
}

function deleteTask(request, reply) {
    var user_id = request.auth.credentials.user_id
    var task_id = request.params.task_id;
    storage.findProjectOfTask(task_id).then(function(result) {
        if (!result) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
            return
        }
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.deleteTask(task_id).then(function() {
                analytics.task.logTaskActivity({
                  activity: 'X',
                  date: moment().format('YYYY-MM-DD HH:mm:ss'),
                  userId: request.auth.credentials.user_id,
                  projectId: project.id,
                  taskId: task_id
                })
                socket.sendMessageToProject(request.payload.project_id, 'delete_task', {
                    task_id: task_id, sender: user_id
                })
                reply({
                    status: constants.STATUS_OK
                });
            });
        })
    })
}
