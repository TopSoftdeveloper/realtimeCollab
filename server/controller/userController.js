var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var Jwt = require('jsonwebtoken');
var config = require('config');
var helper = require('../utils/helper');
var secret_key = config.get('authentication.privateKey');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    getInfo: {
        handler: populate,
        validate: {
            params: {
                user_id: Joi.string().required()
            }
        }
    }
};

function populate(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        if (err || (decoded.user_id !== request.params.user_id)) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }
        storage.getProjectsOfUser(decoded.user_id).then(function(projects) {
            Promise.map(projects, function(project) {
                return storage.getMilestonesWithTasks(project.id);
            }).then(function(milestones) {
                var projectsData = JSON.parse(JSON.stringify(projects));
                var milestonesData = JSON.parse(JSON.stringify(milestones));
                milestonesData = milestonesData.map(function(arr) {
                    return {milestones: arr};
                });
                reply({projects:_.merge(projectsData, milestonesData)});
            });
        });

    });
}