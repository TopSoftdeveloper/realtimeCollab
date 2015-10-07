var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var accessControl = require('./accessControl');
var Jwt = require('jsonwebtoken');
var config = require('config');
var helper = require('../utils/helper');
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
                deadline: Joi.string().isoDate().default(null),
                project_id: Joi.string().required()
            }
        }
    },
    getMilestone: {
        handler: getMilestones
    },
    removeMilestone: {
        handler: deleteMilestone,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                milestone_id: Joi.string().required()
            }
        }
    }
};

function createMilestone(request, reply) {
    var milestone = {
        content: request.payload.content,
        deadline: request.payload.deadline,
        project_id: request.payload.project_id
    };
    storage.createMilestone(milestone).then(function(id) {
        milestone.id = id;
        reply(milestone);
    }, function(error) {
        reply(Boom.internal(error));
    });
}

function getMilestones(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        accessControl.isUserPartOfProject(decoded.user_id, request.params.project_id).then(function(isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.getMilestonesWithTasks(request.params.project_id).then(function(milestones) {
                reply({
                    status: constants.STATUS_OK,
                    milestones: milestones
                })
            });
        });
    });
}

function deleteMilestone(request, reply) {
    var milestone_id = request.payload.milestone_id;

    storage.doesMilestoneExist(milestone_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.MILESTONE_NOT_EXIST, milestone_id)));
        } else {
            storage.deleteMilestone(milestone_id).then(function() {
                reply({
                    status: constants.STATUS_OK
                });
            });
        }
    });
}