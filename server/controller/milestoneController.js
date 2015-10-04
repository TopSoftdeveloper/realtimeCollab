var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');

module.exports = {
    createMilestone: {
        handler: createMilestone,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                content: Joi.string().required(),
                deadline: Joi.string().isoDate().default(null)
            }
        }
    },
    getMilestone: {
        auth: 'token',
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
        deadline: request.payload.deadline
    };
    storage.createMilestone(milestone).then(function(id) {
        milestone.id = id;
        reply(milestone);
    }, function(error) {
        reply({
            error: error
        });
    });
}

function getMilestones(request, reply) {
    storage.getMilestonesWithTasks().then(function(milestones) {
        reply({
            status: constants.STATUS_OK,
            milestones: milestones
        })
    });
}

function deleteMilestone(request, reply) {
    var milestone_id = request.payload.milestone_id;

    storage.doesMilestoneExist(milestone_id).then(function(exists) {
        if (!exists) {
            reply({
                status: constants.STATUS_FAIL,
                error: format(constants.MILESTONE_NOT_EXIST, milestone_id)
            });
        } else {
            storage.deleteMilestone(milestone_id).then(function() {
                reply({
                    status: constants.STATUS_OK
                });
            });
        }
    });
}