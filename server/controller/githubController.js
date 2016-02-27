var constants = require('../constants');
var Joi = require('joi');
var Boom = require('boom');
var config = require('config');
var req = require('request');
var clientSecret = config.get('github.client_secret');
var clientId = config.get('github.client_id');
var localtunnel = require('localtunnel');

// localtunnel helps us test webhooks on localhost
var tunnel = localtunnel(4000, function(err, tunnel) {
    if (err) {
        console.log(err)
    }
});

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
    }
};

function setupWebhook(request, reply) {
    var owner = request.payload.owner;
    var name = request.payload.name;
    var token = request.payload.token; // user's github token
    var options = {
        url: 'https://api.github.com/repos/' + owner + '/' + name + '/hooks',
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