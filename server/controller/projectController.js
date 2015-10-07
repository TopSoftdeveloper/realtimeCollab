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
    },
    getProjects: {
        handler: getProjects,
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        }
    },
    joinProject: {
        handler: joinProject,
        validate: {
            payload: {
                project_id: Joi.string().required(),
                user_id: Joi.string().required()
            }
        }
    }
};

function joinProject(request, reply) {
    storage.joinProject(request.payload.user_id, request.payload.project_id).then(function() {
        return reply({status: constants.STATUS_OK});
    }, function(err) {
        console.log(err);
        return reply({status: constants.STATUS_FAIL});
    });
}

function getProjects(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        if (err || (decoded.user_id !== request.params.user_id)) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.getProjectsOfUser(decoded.user_id).then(function(projects) {
            reply({user_id: decoded.user_id, projects: projects});
        });
    });
}

function createProject(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        if (err) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.createProject(request.payload.content).then(function(project) {
            storage.addProjectToUser(decoded.user_id, project).then(function(obj) {
                reply({project_id: project.id});
            });
        }, function(error) {
            reply(Boom.internal(error));
        });
    });
}