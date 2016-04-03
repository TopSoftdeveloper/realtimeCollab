var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var config = require('config');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var token_expiry = config.get('authentication.tokenExpirySeconds');
var privateKey = config.get('authentication.privateKey');
var CLIENT_ID = config.get('google.client_id');
var CLIENT_SECRET = config.get('google.client_secret');
var REDIRECT_URL = config.get('web.hostname')
var req = require("request")
var Joi = require('joi');

var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

module.exports = {
    login: {
        auth: false,
        handler: login,
        payload: {
            parse: true
        }
    },
    refreshGoogleToken: {
        handler: refreshGoogleToken
    }
};

function validateTokens(request, reply) {
    // validate whether tokens are not expired
    // If expired, refresh and return updated one.

}

function get_token(private_key, user_id, expires_in) {
    var token_data = {
        user_id: user_id,
        expiresIn: expires_in
    };
    return Jwt.sign(token_data, private_key);
}

function isProfileUpdated(last, current) {
    return last.display_name !== current.display_name ||
            last.display_image !== current.display_image ||
            last.email !== current.email ||
            last.refresh_token !== current.refresh_token
}

function refreshGoogleToken(request, reply) {
    var userId = request.auth.credentials.user_id
    storage.findUserById(userId).then(function(user) {
        if (!user) {
            reply(Boom.forbidden(constants.FORBIDDEN))
        } else {
            var options = {
                url: 'https://www.googleapis.com/oauth2/v4/token'
            }
            req.post(options)
            .form({
                    refresh_token: user.refresh_token,
                    client_secret: CLIENT_SECRET,
                    client_id: CLIENT_ID,
                    grant_type: 'refresh_token'
                })
            .on('error', function(err) {
                console.error(err)
                reply(Boom.badRequest());
            })
            .on('response', function(res) {
                reply(res)
            })
        }
    })
}

function login(request, reply) {
    oauth2Client.getToken(request.payload.code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if(!err) {
            var access_token = tokens.access_token
            var refresh_token = tokens.refresh_token
            var options = {
                url: 'https://www.googleapis.com/plus/v1/people/me',
                headers: {
                    'User-Agent': 'Collab',
                    'Authorization': 'Bearer ' + access_token
                }
            }

            req.get(options , function(err, res, body) {
                if (err) {
                    console.error(err)
                    reply(Boom.badRequest(err))
                    return
                }
                var profileInfo = JSON.parse(body)
                var googleId = profileInfo.id
                var u = {
                    display_image: profileInfo.image.url,
                    display_name: profileInfo.displayName,
                    email: profileInfo.emails[0].value
                }
                if (refresh_token) u.refresh_token = refresh_token

                storage.findUser(googleId).then(function(user) {
                    if (!user) {
                        storage.createUser(u).then(function(user) {
                            delete user.refresh_token // don't return this for security
                            user.google_token = access_token
                            user.collab_token = get_token(privateKey, user.id, token_expiry)
                            reply(user);
                        }, function(error) {
                            reply(Boom.forbidden(error));
                        });
                    } else {
                        if (isProfileUpdated(user, u)) {
                            storage.updateUser(user.id, u)
                        }
                        user = JSON.parse(JSON.stringify(user))
                        user.google_token = access_token
                        user.collab_token = get_token(privateKey, user.id, token_expiry)
                        delete user.refresh_token // don't return this for security
                        reply(user);
                    }
                })
            })

        } else {
            console.error(err)
            reply(Boom.badRequest(err))
        }
    });
}