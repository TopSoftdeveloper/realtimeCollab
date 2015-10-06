var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var config = require('config');
var helper = require('../utils/helper');
var secret_key = config.get('authentication.privateKey');

module.exports = {
    createProject: {
        handler: createProject,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                content: Joi.string().required()
            }
        }
    }
};

function createProject(request, reply) {
    var auth_header = request.headers.authorization;
    Jwt.verify(helper.getTokenFromAuthHeader(auth_header), secret_key, function(err, decoded) {
        storage.createProject(request.payload.content).then(function(project) {
            storage.addProjectToUser(decoded.user_id, project).then(function(obj) {
                reply({project_id: project.id});
            });
        }, function(error) {
            reply(Boom.internal(error));
        });
    });
}