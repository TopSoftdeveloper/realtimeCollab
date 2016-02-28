var constants = require('../constants');
var Joi = require('joi');
var Boom = require('boom');
var config = require('config');
var req = require('request');
var Jwt = require('jsonwebtoken')
var storage = require('../data/storage')
var helper = require('../utils/helper')
var accessControl = require('./accessControl');
var clientSecret = config.get('github.client_secret');
var clientId = config.get('github.client_id');
var secret_key = config.get('authentication.privateKey')
var localtunnel = require('localtunnel');
var GITHUB_ENDPOINT = 'https://api.github.com'
var Sequelize = require('sequelize');

// localtunnel helps us test webhooks on localhost
//var tunnel = localtunnel(4000, function(err, tunnel) {
//    if (err) {
//        console.log(err)
//    }
//});
var MILESTONE_MAPPING = {} // maps github milestone id to our own milestone ids

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
    }
};

function addGithubMilestonesToDB(milestones, projectId) {
    var promises = []
    milestones.forEach(function(githubMilestone) {
        var milestone = {
            content: githubMilestone.title,
            deadline: githubMilestone.due_on,
            project_id: projectId,
            github_id: githubMilestone.id
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
            deadline: null,
            is_time_specified: false,
            completed_on: issue.closed_at,
            github_id: issue.id,
            project_id: projectId
        }
        if (issue.milestone) {
            if (MILESTONE_MAPPING[issue.milestone.id]) {
                task.milestone_id = MILESTONE_MAPPING[issue.milestone.id]
                promises.push(storage.findOrCreateTask(task))
            } else {
                var milestonePromise = storage.getMilestonesWithCondition({github_id: issue.milestone.id})
                promises.push(milestonePromise)
                milestonePromise.done(function(milestones) {
                    MILESTONE_MAPPING[issue.milestone.id] = milestones[0].id
                    task.milestone_id = MILESTONE_MAPPING[issue.milestone.id]
                    promises.push(storage.findOrCreateTask(task))
                })
            }
        } else {
            promises.push(storage.findOrCreateTask(task))
        }
    })
    return Sequelize.Promise.all(promises)
}

function githubIssuesToCollab(owner, name, token, reply, projectId) {
    var issueOptions = {
        url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + name + '/issues?state=all',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + token
        }
    }
    req.get(issueOptions , function(err, res, body) {
        if (err) {
            reply(err)
            return
        }
        var githubIssues = JSON.parse(body)
        if (githubIssues.length === 0) {
            reply({message: 'No issues to add'})
        } else {
            addGithubIssuesToDB(githubIssues, projectId).done(function() {
                reply({status: 'OK'})
            })
        }
    })
}

function syncHandler(request, reply) {
    /**
     * Syncs Github issues, milestones etc. with Collab's
     * Should be used when a project is initially connected to Github
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

            var milestoneOptions = {
                url: GITHUB_ENDPOINT + '/repos/' + owner + '/' + name + '/milestones?state=all',
                headers: {
                    'User-Agent': 'Collab',
                    'Authorization': 'Bearer ' + token
                }
            }

            req.get(milestoneOptions, function(err, res, body) {
                if (err) {
                    console.log(err)
                    reply(err)
                    return
                }
                var githubMilestones = JSON.parse(body)
                if (githubMilestones.length > 0) {
                    addGithubMilestonesToDB(githubMilestones, projectId).done(function(milestones) {
                        milestones.forEach(function(m) {
                            MILESTONE_MAPPING[m.github_id] = m.id
                        })
                        githubIssuesToCollab(owner, name, token, reply, projectId)
                    })
                } else {
                    githubIssuesToCollab(owner, name, token, reply, projectId)
                }
            })


            // Get all collab issues, add to github

            // Save returned IDs


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
    console.log('************************ HEADERS *************************')
    var headers = request.headers
    console.log(headers['x-github-event'])
    switch (headers['x-github-event']) {
        case 'issues':
            break
        case 'issue_comment':
            break
        default:
            break
    }

    console.log('************************ PAYLOAD *************************')
    console.log(request.payload)
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