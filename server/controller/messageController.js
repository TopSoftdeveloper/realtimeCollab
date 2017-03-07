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
  createMessage: {
    handler: createMessageHandler,
    payload: {
      parse: true,
    },
    validate: {
      payload: {
        content: Joi.string().required(),
        project_id: Joi.string().required(),
        milestone_id: Joi.default(null),
        author_id: Joi.default(null),
        pinned: Joi.boolean(),
      },
    },
  },
  updateMessage: {
    handler: updateMessageHandler,
    payload: {
      parse: true,
    },
  },
};

function createMessageHandler(request, reply) {
  var user_id = request.auth.credentials.user_id;
  var projectId = request.payload.project_id;
  accessControl.isUserPartOfProject(user_id, projectId).then(function (isPartOf) {
    if (!isPartOf) {
      reply(Boom.forbidden(constants.FORBIDDEN));
      return;
    }

    storage.createMessage(request.payload).then(function(newMessage) {
      reply(newMessage);
    }, function(error) {
      reply(Boom.badRequest(error));
    });
  });
}

function updateMessageHandler(request, reply) {
  var message_id = request.params.message_id;
  var user_id = request.auth.credentials.user_id;
  storage.findProjectOfMessage(message_id).then(function(result) {
    if (!result) {
      reply(Boom.badRequest(format(constants.MESSAGE_NOT_EXIST, message_id)));
      return
    }
    var project = result.project;
    accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
      if (!isPartOf) {
        reply(Boom.forbidden(constants.FORBIDDEN));
        return;
      }
      storage.updateMessage(request.payload, message_id).then(function(t) {
        reply({status: constants.STATUS_OK});
      });
    });
  });
}
