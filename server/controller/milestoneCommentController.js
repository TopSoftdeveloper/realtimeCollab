var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var socket = require('./socket/handlers');
var moment = require('moment');
var helper = require('../utils/helper');
var config = require('config');
var camelcaseKeys = require('camelcase-keys');
var Promise = require("bluebird");
var github = require('./githubController');
var accessControl = require('./accessControl');
var analytics = require('collab-analytics')(config.database, config.logging_database);

module.exports = {
  createMilestoneComment: {
    handler: createMilestoneComment,
    payload: {
      parse: true,
    },
    validate: {
      payload: {
        content: Joi.string().required(),
        project_id: Joi.string().required(),
        milestone_id: Joi.string().required(),
        author_id: Joi.default(null),
        pinned: Joi.boolean(),
      },
    },
  },
};

function createMilestoneComment(request, reply) {
  var user_id = request.auth.credentials.user_id;
  var projectId = request.payload.project_id;
  accessControl.isUserPartOfProject(user_id, projectId).then(function (isPartOf) {
    if (!isPartOf) {
      reply(Boom.forbidden(constants.FORBIDDEN));
      return;
    }

    storage.createMilestoneComment(request.payload).then(function(newMilestoneComment) {
      reply(newMilestoneComment);
    }, function(error) {
      reply(Boom.badRequest(error));
    });
  });
}
