var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var accessControl = require('./accessControl');
var socket = require('./socket/handlers');
var helper = require('../utils/helper');
var config = require('config');
var Jwt = require('jsonwebtoken');

var secret_key = config.get('authentication.privateKey');

module.exports = {
    createMilestone: {
        handler: createMilestone,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                content: Joi.string().required(),
                deadline: Joi.string().isoDate().allow('').default(null),
                project_id: Joi.string().required()
            }
        }
    },
    updateMilestone: {
        handler: updateMilestone,
        payload: {
            parse: true
        }
    },
    removeMilestone: {
        handler: deleteMilestone
    }
};

function updateMilestone(request, reply) {
    var milestone_id = request.params.milestone_id;
    var payload = request.payload
    storage.updateMilestone(payload, milestone_id).then(function(m) {
        reply({
            status: constants.STATUS_OK
        });
    }, function(error) {
        reply(Boom.internal(error));
    });
}

function createMilestone(request, reply) {
    var milestone = {
        content: request.payload.content,
        deadline: request.payload.deadline ? request.payload.deadline : null, // convert empty string to null
        project_id: request.payload.project_id
    };
    storage.createMilestone(milestone).then(function(m) {
        milestone.id = m.id;
        Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
            socket.sendMessageToProject(request.payload.project_id, 'new_milestone', {
                milestone: milestone, sender: decoded.user_id
            })
        });
        reply(milestone);
    }, function(error) {
        reply(Boom.internal(error));
    });
}

function deleteMilestone(request, reply) {
    var milestone_id = request.params.milestone_id;

    storage.doesMilestoneExist(milestone_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.MILESTONE_NOT_EXIST, milestone_id)));
        } else {
            storage.deleteMilestone(milestone_id).then(function() {
                Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
                    socket.sendMessageToProject(request.payload.project_id, 'delete_milestone', {
                        milestone_id: milestone_id, sender: decoded.user_id
                    })
                });
                reply({
                    status: constants.STATUS_OK
                });
            });
        }
    });
}