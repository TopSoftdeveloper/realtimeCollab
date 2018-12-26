var constants = require('../constants');
var Joi = require('joi');
var Boom = require('boom');
var config = require('config');
var storage = require('../data/storage')
var helper = require('../utils/helper')
var accessControl = require('./accessControl');
var req = require("request")
var GITHUB_ENDPOINT = constants.GITHUB_ENDPOINT
var Newsfeed = require('./newsfeedController')
var socket = require('./socket/handlers');
var templates = require('./../templates')
var HOSTNAME = config.get('web.hostname')
var moment = require('moment');
var analytics = require('collab-analytics')(config.database, config.logging_database);

// localtunnel helps us test webhooks on localhost
//var tunnel = localtunnel(4000, function(err, tunnel) {
//    if (err) {
//        console.log(err)
//    }
//});

module.exports = {
    githubWebhook: {
        auth: false,
        handler: githubWebhookHandler,
        payload: {
            parse: true
        }
    },
    googleDriveWebhook: {
        auth: false,
        handler: driveWebhookHandler,
        payload: {
            parse: true
        }
    },
    setupGithubWebhook: {
        handler: setupGithubWebhook,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                owner: Joi.string().required(),
                name: Joi.string().required(),
                token: Joi.string().required()
            }
        }
    }
};


function setupGithubWebhook(request, reply) {
    var owner = request.payload.owner;
    var name = request.payload.name;
    var token = request.payload.token; // user's github token
    var options = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + name + '/hooks',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        }
    }

    var payload = {
        "name": "web",
        "active": true,
        "events": [
            "create",
            "push",
            "issues"
        ],
        "config": {
            "url": HOSTNAME + "/webhook/github",
            "content_type": "json"
        }
    }

    req.post(options)
        .form(
            JSON.stringify(payload)
        )
        .on('error', function(err) {
            reply(Boom.internal(err));
        })
        .on('response', function(res) {
            reply(res)
        })
}

function githubWebhookHandler(request, reply) {
    //https://developer.github.com/webhooks/#events
    var payload = request.payload
    var event = request.headers['x-github-event']
    var githubUser = payload.sender.login
    var repoName = payload.repository.name
    var repoOwner = payload.repository.owner.name
    if (!repoOwner) repoOwner = payload.repository.owner.login

    var promise = storage.getUsersWithCondition({github_login: githubUser})

    storage.getProjectsWithCondition({
        github_repo_name: repoName,
        github_repo_owner: repoOwner
    }).done(function(projects) {
        reply({status: 'ok'})
        if (!projects || projects.length === 0) return

        promise.done(function(users) {
            if (!users || users.length === 0) return
            var userId = users[0].id
            var userDisplayName = users[0].display_name
            projects.forEach(function(project) {
                if (event === 'push') {
                    // Any Git push to a Repository, including editing tags or branches.
                    // Commits via API actions that update references are also counted. This is the default event.
                    var commits = payload.commits
                    if (commits.length !== 0) {
                        // commits.forEach(function(commit) {
                        //   analytics.github.logCommit(project.id, commit);
                        // });
                        Newsfeed.updateNewsfeed(
                            { commitSize: commits.length, user_id: userId },
                            templates.GITHUB_PUSH, project.id, constants.GITHUB, new Date().toISOString())
                    }

                } else if (event === 'create') {
                    // Any time a Branch or Tag is created..
                    var ref = payload.ref
                    var ref_type = payload.ref_type // either branch or tag
                    Newsfeed.updateNewsfeed(
                        { ref_type: ref_type, ref: ref, user_id: userId },
                        templates.GITHUB_CREATE, project.id, constants.GITHUB, new Date().toISOString())
                } else if (event === 'release') {
                    var release = payload.release;
                    if (release !== null && release !== undefined) {
                        analytics.github.logRelease(project.id, release);
                    }
                } else if (event === 'issues') {
                    //Any time an Issue is assigned, unassigned, labeled, unlabeled, opened, edited, milestoned, demilestoned, closed, or reopened.
                    storage.getTasksWithCondition({ github_id: payload.issue.id }).then(function (tasks) {
                        if (!tasks || tasks.length === 0) return
                        var task = tasks[0]
                        var change
                        switch (payload.action) {
                            case 'assigned':
                            case 'unassigned':
                                var newAssignee
                                var update_assignee = function () {
                                    storage.updateTask({ assignee_id: newAssignee }, task.id).then(function () {
                                        var originalAssignee = {
                                            id: task.assignee_id,
                                        }
                                        var updatedAssignee = {
                                            id: newAssignee,
                                        }
                                        storage.findUserById(task.assignee_id).then(function (originalAssigneeResult) {
                                            if (originalAssigneeResult !== null) {
                                                originalAssignee.display_name = originalAssigneeResult.display_name;
                                            }
                                            storage.findUserById(newAssignee).then(function (updatedAssigneeResult) {
                                                if (updatedAssigneeResult !== null) {
                                                    updatedAssignee.display_name = updatedAssigneeResult.display_name;
                                                }
                                                storage.createSystemMessage(project.id, task.milestone_id,
                                                    constants.systemMessageTypes.REASSIGN_TASK_TO_USER, {
                                                        user: {
                                                            id: userId,
                                                            display_name: userDisplayName,
                                                        },
                                                        task: {
                                                            id: task.id,
                                                            content: task.content,
                                                            originalAssignee,
                                                            updatedAssignee,
                                                        },
                                                    }).then(function (message) {
                                                        socket.sendNewSystemMessageToProject(project.id, message);
                                                    });
                                            });
                                        });
                                    })
                                }
                                if (payload.issue.assignee) {
                                    storage.getUsersWithCondition({ github_login: payload.issue.assignee.login }).then(function (users) {
                                        if (!users || users.length === 0) {
                                            newAssignee = payload.issue.assignee.login
                                        } else {
                                            newAssignee = users[0].id
                                        }
                                    }).then(function () {
                                        update_assignee()
                                    })
                                } else {
                                    newAssignee = ''
                                    update_assignee()
                                }
                                break;
                            case 'closed':
                                change = { completed_on: payload.issue.closed_at }
                                storage.updateTask(change, task.id).then(function () {
                                    storage.createSystemMessage(project.id, task.milestone_id,
                                        constants.systemMessageTypes.MARK_TASK_AS_DONE, {
                                            user: {
                                                id: userId,
                                                display_name: userDisplayName,
                                            },
                                            task: {
                                                id: task.id,
                                                content: task.content,
                                            },
                                        }).then(function (message) {
                                            socket.sendNewSystemMessageToProject(project.id, message)
                                        }, function (err) {
                                            console.error('store fail to create message');
                                            console.error(err);
                                        });
                                })
                                break;
                            case 'reopened':
                                change = { completed_on: null }
                                storage.updateTask(change, task.id).then(function () {
                                    storage.createSystemMessage(project.id, task.milestone_id,
                                        constants.systemMessageTypes.REOPEN_TASK, {
                                            user: {
                                                id: userId,
                                                display_name: userDisplayName,
                                            },
                                            task: {
                                                id: task.id,
                                                content: task.content,
                                            },
                                        }).then(function (message) {
                                            socket.sendNewSystemMessageToProject(project.id, message)
                                        });
                                })
                                break;
                            case 'edited':
                                if (task.content !== payload.issue.title) {
                                    change = { content: payload.issue.title }
                                    storage.updateTask(change, task.id).then(function () {
                                        storage.createSystemMessage(project.id, task.milestone_id,
                                            constants.systemMessageTypes.EDIT_TASK_CONTENT, {
                                                user: {
                                                    id: userId,
                                                    display_name: userDisplayName,
                                                },
                                                task: {
                                                    id: payload.issue.id,
                                                    originalContent: task.content,
                                                    updatedContent: payload.issue.title,
                                                },
                                            }).then(function (message) {
                                                socket.sendNewSystemMessageToProject(project.id, message)
                                            });
                                    })
                                }
                                break;
                        }
                        if (payload.action === 'closed') {
                            analytics.task.logTaskActivity(
                                analytics.task.constants.ACTIVITY_DONE,
                                moment().format('YYYY-MM-DD HH:mm:ss'),
                                userId,
                                task
                            )
                            socket.sendMessageToProject(project.id, 'mark_done', {
                                task_id: task.id, sender: userId
                            })
                            Newsfeed.updateNewsfeed(
                                { title: payload.issue.title, user_id: userId },
                                templates.GITHUB_ISSUES, project.id, constants.GITHUB, new Date().toISOString())
                        } else if (payload.action === 'assigned'
                            || payload.action === 'unassigned'
                            || payload.action === 'reopened'
                            || (payload.action === 'edited' && task.content !== payload.issue.title)) {
                            analytics.task.logTaskActivity(
                                analytics.task.constants.ACTIVITY_UPDATE,
                                moment().format('YYYY-MM-DD HH:mm:ss'),
                                userId,
                                task
                            )
                            if (payload.action === 'assigned') {
                                analytics.task.logTaskActivity(
                                    analytics.task.constants.ACTIVITY_ASSIGN,
                                    moment().format('YYYY-MM-DD HH:mm:ss'),
                                    userId,
                                    task
                                )
                            }
                            socket.sendMessageToProject(project.id, 'update_task', {
                                task: change, sender: userId, task_id: task.id
                            })
                            Newsfeed.updateNewsfeed(
                                { title: payload.issue.title, user_id: userId },
                                templates.GITHUB_ISSUES, project.id, constants.GITHUB, new Date().toISOString())
                        }
                    }, function (err) {
                        console.log(err)
                    })
                }
            })
        })
    })
}

function driveWebhookHandler(request, reply) {
    var changes = request.payload.changes
    changes.forEach(function(change) {
        var file = change.file
        var lastModifiedBy = file.lastModifyingUser.emailAddress
        var data = {
            fileId: file.id,
            fileName: file.name,
            email: lastModifiedBy
        }
        var template = templates.DRIVE_UPDATE
        var activity = analytics.drive.constants.FILE_MODIFIED
        if (change.removed || file.trashed) {
            template = templates.DRIVE_REMOVE
            activity = analytics.drive.constants.FILE_DELETED
        }

        analytics.drive.logFileActivity(
          activity,
          change.time,
          lastModifiedBy,
          null,
          file
        )
        Newsfeed.updateNewsfeed(data, template, projectId, constants.GOOGLE_DRIVE, file.modifiedTime)
    })
}
