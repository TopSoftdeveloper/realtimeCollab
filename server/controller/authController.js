var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var config = require('config');

var token_expiry = config.get('authentication.tokenExpirySeconds');
var privateKey = config.get('authentication.privateKey');

module.exports = {
    login: {
        auth: false,
        handler: login,
        payload: {
            parse: true
        }
    }
};

function get_token(private_key, user_id, expires_in) {
    var token_data = {
        user_id: user_id,
        expiresIn: expires_in
    };
    return Jwt.sign(token_data, private_key);
}

function isProfileUpdated(last, current) {
    return last.display_name !== current.display_name ||
            last.display_image !== current.display_image
}

function login(request, reply) {
    storage.findUser(request.payload.google_id).then(function(user) {
        if (user === null) {
            storage.createUser(request.payload).then(function(user) {
                reply({
                    user_id: user.id,
                    token: get_token(privateKey, user.id, token_expiry)
                });
            }, function(error) {
                reply(Boom.forbidden(error));
            });
        } else {
            reply({
                user_id: user.id,
                token: get_token(privateKey, user.id, token_expiry)
            });

            if (isProfileUpdated(user, request.payload)) {
                storage.updateUser(user.id, request.payload)
            }

        }
    })
}