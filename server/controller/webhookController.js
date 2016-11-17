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
var templates = require('./../templates')
var HOSTNAME = config.get('web.hostname')
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
            "push"
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
            projects.forEach(function(project) {
                if (event === 'push') {
                    // Any Git push to a Repository, including editing tags or branches.
                    // Commits via API actions that update references are also counted. This is the default event.
                    var commits = payload.commits
                    if (commits.length !== 0) {
                        commits.forEach(function(commit) {
                          analytics.github.logCommit(project.id, commit);
                        });
                        Newsfeed.updateNewsfeed(
                            {commitSize: commits.length, user_id: userId},
                            templates.GITHUB_PUSH, project.id, constants.GITHUB,  new Date().toISOString())
                    }

                } else if (event === 'create') {
                    // Any time a Branch or Tag is created..
                    var ref = payload.ref
                    var ref_type = payload.ref_type // either branch or tag
                    Newsfeed.updateNewsfeed(
                        {ref_type: ref_type, ref: ref, user_id: userId},
                        templates.GITHUB_CREATE, project.id, constants.GITHUB,  new Date().toISOString())
                } else if (event === 'release') {
                  var release = payload.release;
                  if (release !== null && release !== undefined) {
                    analytics.github.logRelease(project.id, release);
                  }
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
