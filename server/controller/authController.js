var Bcrypt = require('bcrypt');
var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var config = require('config');

var token_expiry = config.get('authentication.tokenExpirySeconds');
var privateKey = config.get('authentication.privateKey');

module.exports = {
    createAccount: {
        auth: false,
        handler: create_account,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(3).required(),
                display_name: Joi.string().required()
            }
        }
    },
    login: {
        auth: false,
        handler: login,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(3).required()
            }
        }
    }
};

function get_token(private_key, email, user_id, expires_in) {
    var token_data = {
        email: email,
        user_id: user_id,
        expiresIn: expires_in
    };
    return Jwt.sign(token_data, private_key);
}

function create_account(request, reply) {
    var password = request.payload.password;
    var email = request.payload.email;
    var display_name = request.payload.display_name;

    storage.doesUserExist(email).then(function(exists) {
        if (exists) {
            reply(Boom.forbidden(format(constants.EMAIL_ALREADY_EXISTS, email)));
            return;
        }

        Bcrypt.genSalt(10, function(err, salt) {
            Bcrypt.hash(password, salt, function(err, hash) {
                storage.createUser(salt, hash, email, display_name).then(function(user) {
                    reply({
                        email: email,
                        user_id: user.id,
                        token: get_token(privateKey, user.email, user.id, token_expiry),
                        display_name: display_name
                    });
                }, function(error) {
                    reply(Boom.forbidden(error));
                });
            });
        });

    });
}

function login(request, reply) {
    var password = request.payload.password;
    var email = request.payload.email;

    storage.findUser(email).then(function(user) {
        if (user === null) {
            reply(Boom.forbidden(constants.AUTHENTICATION_ERROR));
            return;
        }

        Bcrypt.hash(password, user.salt, function(err, hash) {
            if (hash !== user.password) {
                reply(Boom.forbidden(constants.AUTHENTICATION_ERROR));
                return;
            }

            reply({
                email: user.email,
                user_id: user.id,
                token: get_token(privateKey, user.email, user.id, token_expiry),
                display_name: user.display_name                
            });
        });

    }, function(error) {
        reply(Boom.forbidden(constants.AUTHENTICATION_ERROR));
    })
}