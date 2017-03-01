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
var Sequelize = require('sequelize');
var GITHUB_ENDPOINT = constants.GITHUB_ENDPOINT
var req = require("request")

var _ = require('lodash');

module.exports = {
  getInfo: {
    handler: populate
  },
  updateInfo: {
    handler: updateInfo,
    validate: {
      params: {
        user_id: Joi.string().required()
      }
    }
  },
  updateGithubLogin: {
    handler: updateGithubLogin,
    validate: {
      params: {
        user_id: Joi.string().required(),
      },
      payload: {
        token: Joi.string().required(),
      },
    },
  },
};

function updateGithubLogin(request, reply) {
    var userId = request.params.user_id;
    var options = {
        url: GITHUB_ENDPOINT + '/user',
        headers: {
            'User-Agent': 'Collab',
            'Authorization': 'Bearer ' + request.payload.token
        }
    }
    req.get(options , function(err, res, body) {
        if (err) {
            reply(Boom.badRequest())
            return
        }
        var user = JSON.parse(body)
        storage.updateUser(userId, {github_login: user.login, github_refresh_token: request.payload.token}).then(function() {
            reply({
                status: constants.STATUS_OK
            });
        })
    })
}

function updateInfo(request, reply) {
  const userId = request.params.user_id;
  storage.findUserById(userId).then((user) => {
    if (!user) {
      reply(Boom.notFound());
      return;
    } if (request.payload === null) {
      // Do nothing if no payload sent
      reply({ status: constants.STATUS_OK });
      return;
    }

    const payload = {};
    if (request.payload.display_name) {
      payload.display_name = request.payload.display_name;
    }
    if (request.payload.display_image) {
      payload.display_image = request.payload.display_image;
    }
    if (request.payload.email) {
      payload.email = request.payload.email;
    }
    if (request.payload.google_id) {
      payload.google_id = request.payload.google_id;
    }
    if (request.payload.github_login) {
      payload.github_login = request.payload.github_login;
    }

    storage.updateUser(userId, payload).then(() => {
      reply({ status: constants.STATUS_OK });
    });
  });
}

function normalize(projectsData) {
    // removes the nested 'user_project' and just retains 'role' attribute
    projectsData.forEach(function(project) {
        project.users.forEach(function(user) {
            _.assign(user, {'role': user.user_project.role});
            delete user['user_project'];
        });
    });
    return projectsData;
}

function filterPending(projects, userId) {
    return projects.filter(function(project) {
        var pending = false;
        project.users.forEach(function(user) {
            if (user.id === userId && user.user_project.role === constants.ROLE_PENDING) {
                pending = true;
            }
        });
        if (!pending) {
            return true;
        }
    });
}

function populate(request, reply) {
    var user_id = request.auth.credentials.user_id
    storage.getProjectsOfUser(user_id).then(function(projects) {
        var filteredProjects = filterPending(projects, user_id);
        Promise.map(filteredProjects, function(project) { // only use projects which are not pending
            var promises = []
            // Some tasks do not have milestones and vice versa, so we have to get both separately
            promises.push(storage.getMilestonesWithCondition({project_id: project.id}))
            promises.push(storage.getTasksWithCondition({project_id: project.id}))
            promises.push(storage.getMilestoneCommentsWithCondition({project_id: project.id}));
            return Sequelize.Promise.all(promises)
        }).then(function(tasksAndMilestones) {
            var projectsData = normalize(JSON.parse(JSON.stringify(filteredProjects)))
            tasksAndMilestones = JSON.parse(JSON.stringify(tasksAndMilestones))
            projectsData = projectsData.map(function(project, i) {
                return _.merge(project, {
                    milestones: tasksAndMilestones[i][0]
                }, {
                    tasks: tasksAndMilestones[i][1]
                }, {
                  milestoneComments: tasksAndMilestones[i][2],
                })
            })
            reply({projects: projectsData})
        });
    }).catch(function(err) {
        reply(Boom.badRequest(err));
    });
}
