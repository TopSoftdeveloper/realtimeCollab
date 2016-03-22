var constants = require('../constants');
var Joi = require('joi');
var Boom = require('boom');
var config = require('config');
var Jwt = require('jsonwebtoken')
var storage = require('../data/storage')
var helper = require('../utils/helper')
var accessControl = require('./accessControl');
var clientSecret = config.get('github.client_secret');
var clientId = config.get('github.client_id');
var secret_key = config.get('authentication.privateKey')
var localtunnel = require('localtunnel');
var GITHUB_ENDPOINT = constants.GITHUB_ENDPOINT
var Sequelize = require('sequelize');
var Promise = require("bluebird");
var req = require("request")

// localtunnel helps us test webhooks on localhost
//var tunnel = localtunnel(4000, function(err, tunnel) {
//    if (err) {
//        console.log(err)
//    }
//});

module.exports = {
    getAccessToken: {
        handler: getAccessToken,
        payload: {
            parse:true
        },
        validate: {
            payload: {
                code: Joi.string().required()
            }
        }
    },
    webhook: {
        auth: false,
        handler: webhookHandler,
        payload: {
            parse: true
        }
    },
    setupWebhook: {
        handler: setupWebhook,
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
    },
    sync: {
        handler: syncHandler,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                token: Joi.string().required(),
                owner: Joi.string().required(),
                name: Joi.string().required()
            }
        }
    },
    createGithubIssue: createGithubIssue,
    updateGithubIssue: updateGithubIssue,
    createGithubMilestone: createGithubMilestone,
    updateGithubMilestone: updateGithubMilestone,
    deleteGithubMilestone: deleteGithubMilestone
};

function addCollabMilestonesToGithub(owner, repo, token, projectId) {
    return new Promise(function(RESOLVE, REJECT) {
        storage.getMilestonesWithCondition({github_id: null, project_id: projectId}).done(function(milestones) {
            var promises = []
            milestones.forEach(function(milestone) {
                promises.push(
                    createGithubMilestone(milestone.id, {title: milestone.content}, owner, repo, token)
                )
            }) // milestones.forEach
            Promise.all(promises).then(function(p) {
                RESOLVE(p)
            }).catch(function(err) {
                REJECT(err)
            })
        }) // getMilestonesWithCondition
    })
}

function createGithubMilestone(milestoneId, milestone, owner, repo, token) {
    var options = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + repo + '/milestones',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        },
        form: JSON.stringify(milestone)
    }
    return new Promise(function (resolve, reject) {
        req.post(options, function(err, res, body) {
            if (err) {
                reject(err)
                return
            }
            var parsedBody = JSON.parse(body)
            if (parsedBody.number) {
                storage.updateMilestone({github_id: parsedBody.id, github_number: parsedBody.number}, milestoneId).done(function() {
                    resolve(parsedBody.number)
                })
            } else {
                reject(parsedBody)
            }
        })
    })
}

function createGithubIssue(taskId, issue, owner, repo, token) {
    var options = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + repo + '/issues',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        },
        form: JSON.stringify(issue)
    }

    return new Promise(function (resolve, reject) {
        req.post(options, function(err, res, body) {
            if (err) {
                reject(err)
                return
            }
            var parsedBody = JSON.parse(body)
            if (parsedBody.number) { // if successful, should return issue id and number
                storage.updateTask({github_id: parsedBody.id, github_number: parsedBody.number}, taskId).done(function() {
                    resolve(parsedBody.number)
                })
            } else {
                reject(parsedBody)
            }
        })
    })
}

function deleteGithubMilestone(owner, repo, token, number) {
    var options = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + repo + '/milestones/' + number,
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        }
    }

    return new Promise(function (resolve, reject) {
        req.del(options, function(err, res, body) {
            if (err) {
                reject(err)
                return
            }
            resolve()
        })
    })
}

function updateGithubMilestone(owner, repo, token, number, payload) {
    return githubUpdate('milestones', owner, repo, token, number, payload)
}

function updateGithubIssue(owner, repo, token, number, payload) {
    return githubUpdate('issues', owner, repo, token, number, payload)
}

function githubUpdate(type, owner, repo, token, number, payload) {
    var options = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + repo + '/' + type + '/' + number,
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        },
        form: JSON.stringify(payload)
    }

    return new Promise(function (resolve, reject) {
        req.patch(options, function(err, res, body) {
            if (err) {
                reject(err)
                return
            }
            var parsedBody = JSON.parse(body)
            if (parsedBody.number) { // if successful, should return issue id and number
                resolve(parsedBody.number)
            } else {
                reject(parsedBody)
            }
        })
    })
}

function POSTIssueToGithub(options, taskId, completedOn, owner, name, token) {
    return new Promise(function (resolve, reject) {
        req.post(options, function(err, res, body) {
            if (err) {
                return reject(err)
            }
            var parsedBody = JSON.parse(body)
            if (parsedBody.id) { // if successful, should return issue id
                if (completedOn) {
                    updateGithubIssue(owner, name, token, parsedBody.number, {
                        state: 'closed'
                    }).done(function() {
                        storage.updateTask({github_id: parsedBody.id, github_number: parsedBody.number}, taskId).done(function(res) {
                            resolve(res)
                        })
                    })
                } else {
                    storage.updateTask({github_id: parsedBody.id, github_number: parsedBody.number}, taskId).done(function(res) {
                        resolve(res)
                    })
                }
            } else {
                return reject(err)
            }
        })
    })
}

function addCollabTasksToGithub(owner, name, token, projectId) {
    return new Promise(function (RESOLVE, REJECT) {
        storage.getTasksWithCondition({github_id: null, project_id: projectId}).done(function(tasks) {
            var promises = []
            tasks.forEach(function(task) {
                var options = {
                    url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + name + '/issues',
                    headers: {
                        'User-Agent': 'Collab',
                        'Authorization': 'Bearer ' + token
                    }
                }

                var issueToPOST = {
                    title: task.content
                }

                if (task.milestone_id) { // we need the corresponding github milestone NUMBER
                    storage.getMilestone(task.milestone_id).done(function(milestone) {
                        milestone = JSON.parse(JSON.stringify(milestone))
                        issueToPOST.milestone = milestone.github_number
                        options.form = JSON.stringify(issueToPOST)
                        promises.push(POSTIssueToGithub(options, task.id))
                    })

                } else {
                    options.form = JSON.stringify(issueToPOST)
                    promises.push(POSTIssueToGithub(options, task.id))
                }
            }) // tasks.forEach
            Promise.all(promises).then(function(p) {
                RESOLVE(p)
            }).catch(function(err) {
                REJECT(err)
            })
        }) // getTasksWithCondition
    })
}

function addGithubMilestonesToDB(milestones, projectId) {
    var promises = []
    milestones.forEach(function(githubMilestone) {
        var milestone = {
            content: githubMilestone.title,
            deadline: githubMilestone.due_on,
            project_id: projectId,
            github_id: githubMilestone.id,
            github_number: githubMilestone.number
        }
        promises.push(storage.findOrCreateMilestone(milestone))
    })
    return Sequelize.Promise.all(promises)
}

function addGithubIssuesToDB(issues, projectId) {
    var promises = []
    issues.forEach(function(issue) {
        var task = {
            content: issue.title,
            completed_on: issue.closed_at,
            github_id: issue.id,
            github_number: issue.number,
            project_id: projectId
        }
        if (issue.milestone) {
            var milestonePromise = storage.getMilestonesWithCondition({github_id: issue.milestone.id})
            promises.push(milestonePromise)
            milestonePromise.done(function(milestones) {
                task.milestone_id = milestones[0].id
                promises.push(storage.findOrCreateTask(task))
            })

        } else {
            promises.push(storage.findOrCreateTask(task))
        }
    })
    return Sequelize.Promise.all(promises)
}

function addGithubIssuesToCollab(owner, name, token, projectId) {
    var issueOptions = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + name + '/issues?state=all',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        }
    }
    return new Promise(function (resolve, reject) {
        req.get(issueOptions , function(err, res, body) {
            if (err) {
                return reject(err)
            }
            var githubIssues = JSON.parse(body)
            if (githubIssues.length === 0) {
                return resolve(true)
            } else {
                addGithubIssuesToDB(githubIssues, projectId).done(function(tasks) {
                    return resolve(tasks)
                })
            }
        })
    })
}

function addGithubMilestonesToCollab(owner, name, token, projectId) {
    var milestoneOptions = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + name + '/milestones?state=all',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        }
    }
    return new Promise(function (resolve, reject) {
        req.get(milestoneOptions, function(err, res, body) {
            if (err) {
                return reject(err)
            }
            var githubMilestones = JSON.parse(body)
            if (githubMilestones.length > 0) {
                addGithubMilestonesToDB(githubMilestones, projectId).done(function(milestones) {
                    return resolve(milestones)
                })
            } else {
                return resolve(true)
            }
        })
    })
}

function syncHandler(request, reply) {
    /**
     * Syncs Github issues, milestones etc. with Collab's
     * Should be used when a project is initially connected to Github
     * Milestones should always be added first (before issues/tasks)
     */
    var projectId = request.params.project_id
    var owner = request.payload.owner
    var name = request.payload.name
    var token = request.payload.token

    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function (err, decoded) {
        accessControl.isUserPartOfProject(decoded.user_id, projectId).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }

            addGithubMilestonesToCollab(owner, name, token, projectId).then(function() {
                addGithubIssuesToCollab(owner, name, token, projectId).then(function() {
                    addCollabMilestonesToGithub(owner, name, token, projectId).then(function() {
                        addCollabTasksToGithub(owner, name, token, projectId).then(function() {
                            reply({status: 'OK'})
                        }, function(err) {
                            reply(err)
                        })
                    }, function(err) {
                        reply(err)
                    })
                }, function(err) {
                    reply(err)
                })
            }, function(err) {
                reply(err)
            })
        })
    })
}

function setupWebhook(request, reply) {
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
            "commit_comment",
            "create",
            "delete",
            "fork",
            "issue_comment",
            "issues",
            "member",
            "pull_request",
            "push",
            "release"
        ],
        "config": {
            "url": tunnel.url + "/github/webhook",
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

function webhookHandler(request, reply) {
    var headers = request.headers
    switch (headers['x-github-event']) {
        case 'issues':
            break
        case 'issue_comment':
            break
        default:
            break
    }
    reply({status: 'ok'})
}

function getAccessToken(request, reply) {
    var code = request.payload.code;
    var options = {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
            'Accept': 'application/json'
        }
    }
    req.post(options)
    .form(
        {
            code: code,
            client_secret: clientSecret,
            client_id: clientId
        }
    )
    .on('error', function(err) {
        reply(Boom.internal(err));
    })
    .on('response', function(res) {
        reply(res)
    })
}