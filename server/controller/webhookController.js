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
var Sequelize = require('sequelize');
var Promise = require("bluebird");
var req = require("request")
var localtunnel = require('localtunnel');
var GITHUB_ENDPOINT = constants.GITHUB_ENDPOINT
var Newsfeed = require('./newsfeedController')

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

function githubWebhookHandler(request, reply) {
    //https://developer.github.com/webhooks/#events
    var payload = request.payload
    var event = request.headers['x-github-event']
    if (event === 'push') {
        // Any Git push to a Repository, including editing tags or branches.
        // Commits via API actions that update references are also counted. This is the default event.
        console.log('push')
        var ref = payload.ref
        var comparisonUrl = payload.compare
        var commits = payload.commits
        var repoName = payload.repository.name
        var repoOwner = payload.repository.owner.name
        var githubUser = payload.sender.login
        if (commits.length !== 0) {


        }

    } else if (event === 'create') {
        // Any time a Branch or Tag is created..
        console.log('create')
        var ref = payload.ref
        var ref_type = payload.ref_type // either branch or tag
        var repoName = payload.repository.name
        var repoOwner = payload.repository.owner.login
        var githubUser = payload.sender.login


    }

    reply({status: 'ok'})
}