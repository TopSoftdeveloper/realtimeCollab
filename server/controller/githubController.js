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
var GITHUB_ENDPOINT = constants.GITHUB_ENDPOINT
var Sequelize = require('sequelize');
var Promise = require("bluebird");
var req = require("request")
var analytics = require('collab-analytics')(config.database, config.logging_database);

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
    updateGithubIssue: updateGithubIssue
};

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

                options.form = JSON.stringify(issueToPOST)
                promises.push(POSTIssueToGithub(options, task.id))
            }) // tasks.forEach
            Promise.all(promises).then(function(p) {
                RESOLVE(p)
            }).catch(function(err) {
                REJECT(err)
            })
        }) // getTasksWithCondition
    })
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
        promises.push(storage.findOrCreateTask(task))
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

    analytics.github.pullCommits(projectId, owner, name, token);
    analytics.github.pullReleases(projectId, owner, name, token);

    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function (err, decoded) {
        accessControl.isUserPartOfProject(decoded.user_id, projectId).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }

            var promises = []
            var githubToCollab = new Promise(function (resolve, reject) {
                addGithubIssuesToCollab(owner, name, token, projectId).then(function() {
                    resolve()
                }, function(err) {
                    reject(err)
                })
            })
            var collabToGithub = new Promise(function (resolve, reject) {
                addCollabTasksToGithub(owner, name, token, projectId).then(function() {
                    resolve()
                }, function(err) {
                    reject(err)
                })
            })
            promises.push(githubToCollab)
            promises.push(collabToGithub)
            Promise.all(promises).then(function() {
                reply({status: 'OK'})
            }).catch(function(err) {
                console.log(err)
                reply(err)
            })
        })
    })
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
