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
    removeMilestone: {
        handler: deleteMilestone
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

function deleteMilestone(request, reply) {
    var milestone_id = request.params.milestone_id;

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