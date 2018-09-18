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
var assign = require('object-assign');
var github = require('./githubController');
var accessControl = require('./accessControl');
var analytics = require('collab-analytics')(config.database, config.logging_database);


module.exports = {
    createTask: {
        handler: createTask,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                content: Joi.string().required(),
                project_id: Joi.string().required(),
                completed_on: Joi.string().isoDate().default(null),
                milestone_id: Joi.default(null),
                assignee_id: Joi.default(null),
                github_token: Joi.default(''),
                isGithubIssue: Joi.bool().required()
            }
        }
    },
    getTask: {
        handler: getTask
    },
    updateTask: {
        handler: updateTask,
        payload: {
            parse: true
        }
    },
    markComplete: {
        handler: markTaskAsDone,
        payload: {
            parse: true
        }
    },
    removeTask: {
        handler: deleteTask,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                project_id: Joi.string().required()
            }
        }
    }
};
function updateTask(request, reply) {
    var task_id = request.params.task_id;
    var token = request.payload.github_token
    var user_id = request.auth.credentials.user_id
    request.payload.completed_on = request.payload.completed_on ? request.payload.completed_on : null // convert empty string to null

    storage.findProjectOfTask(task_id).then(function(result) {
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            var project = result.project
            var github_num = result.task.github_number

            // keep a copy of previous taskValus
            var originalTaskValues = assign({}, result.task.get());
            result.task.update(request.payload).then(function(t) {
                analytics.task.logTaskActivity(
                    analytics.task.constants.ACTIVITY_UPDATE,
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    user_id,
                    camelcaseKeys(result.task.toJSON())
                )
                reply({status: constants.STATUS_OK});

                // compare orignial value and update value manually to initiate system message by different attributes
                storage.findUserById(user_id).then(function(user) {
                  var updatedTaskValues = result.task.get();
                  // compare milestone Id
                  if (originalTaskValues.milestone_id !== updatedTaskValues.milestone_id) {
                    var originalMilestone = {
                      id: originalTaskValues.milestone_id,
                    };
                    var updatedMilestone = {
                      id: updatedTaskValues.milestone_id,
                    };
                    storage.findMilestoneById(originalTaskValues.milestone_id).then(function(originalMilestoneResult) {
                      if (originalMilestoneResult !== null) {
                        originalMilestone.content = originalMilestoneResult.content;
                      }
                      storage.findMilestoneById(updatedTaskValues.milestone_id).then(function(updatedMilestoneResult) {
                        if (updatedMilestoneResult !== null) {
                          updatedMilestone.content = updatedMilestoneResult.content;
                        }
                        storage.createSystemMessage(updatedTaskValues.project_id, originalTaskValues.milestone_id,
                        constants.systemMessageTypes.REASSIGN_TASK_TO_MILESTONE, {
                          user: {
                            id: user.id,
                            display_name: user.display_name,
                          },
                          task: {
                            id: updatedTaskValues.id,
                            content: originalTaskValues.content,
                            originalMilestone,
                            updatedMilestone,
                          },
                        }).then(function(message) {
                          socket.sendNewSystemMessageToProject(updatedTaskValues.project_id, message)
                        });
                        storage.createSystemMessage(updatedTaskValues.project_id, updatedTaskValues.milestone_id,
                        constants.systemMessageTypes.REASSIGN_TASK_TO_MILESTONE, {
                          user: {
                            id: user.id,
                            display_name: user.display_name,
                          },
                          task: {
                            id: updatedTaskValues.id,
                            content: updatedTaskValues.content,
                            originalMilestone,
                            updatedMilestone,
                          },
                        }).then(function(message) {
                          socket.sendNewSystemMessageToProject(updatedTaskValues.project_id, message)
                        });
                      });
                    });
                  }
                  if (originalTaskValues.content !== updatedTaskValues.content) {
                    storage.createSystemMessage(updatedTaskValues.project_id, updatedTaskValues.milestone_id,
                    constants.systemMessageTypes.EDIT_TASK_CONTENT, {
                      user: {
                        id: user.id,
                        display_name: user.display_name,
                      },
                      task: {
                        id: updatedTaskValues.id,
                        originalContent: originalTaskValues.content,
                        updatedContent: updatedTaskValues.content,
                      },
                    }).then(function(message) {
                      socket.sendNewSystemMessageToProject(updatedTaskValues.project_id, message)
                    });
                  }
                  if (originalTaskValues.assignee_id !== updatedTaskValues.assignee_id) {
                    var originalAssignee = {
                      id: originalTaskValues.assignee_id,
                    }
                    var updatedAssignee = {
                      id: updatedTaskValues.assignee_id,
                    }
                    storage.findUserById(originalTaskValues.assignee_id).then(function(originalAssigneeResult) {
                      if (originalAssigneeResult !== null) {
                        originalAssignee.display_name = originalAssigneeResult.display_name;
                      }
                      storage.findUserById(updatedTaskValues.assignee_id).then(function(updatedAssigneeResult){
                        if (updatedAssigneeResult !== null) {
                          updatedAssignee.display_name = updatedAssigneeResult.display_name;
                        }
                        storage.createSystemMessage(updatedTaskValues.project_id, updatedTaskValues.milestone_id,
                        constants.systemMessageTypes.REASSIGN_TASK_TO_USER, {
                          user: {
                            id: user.id,
                            display_name: user.display_name,
                          },
                          task: {
                            id: updatedTaskValues.id,
                            content: updatedTaskValues.content,
                            originalAssignee,
                            updatedAssignee,
                          },
                        }).then(function(message) {
                          socket.sendNewSystemMessageToProject(updatedTaskValues.project_id, message);
                        });
                      });
                    });
                  }
                  if (originalTaskValues.completed_on !== updatedTaskValues.completed_on) {
                    storage.createSystemMessage(updatedTaskValues.project_id, updatedTaskValues.milestone_id,
                    constants.systemMessageTypes.REOPEN_TASK, {
                      user: {
                        id: user.id,
                        display_name: user.display_name,
                      },
                      task: {
                        id: updatedTaskValues.id,
                        content: updatedTaskValues.content,
                      },
                    }).then(function(message) {
                      socket.sendNewSystemMessageToProject(updatedTaskValues.project_id, message)
                    });
                  }
                });

                socket.sendMessageToProject(project.id, 'update_task', {
                    task: request.payload, sender: user_id, task_id: task_id
                })
                if (!token || !github_num) return
                // Add the same task to github issues
                var owner = project.github_repo_owner
                var repo = project.github_repo_name
                var payload = {title: request.payload.content}

                if (request.payload.completed_on === null) {
                    payload.state = 'open'
                }

                if (request.payload.assignee_id) {
                    storage.findGithubLogin(request.payload.assignee_id).then(function(login) {
                        payload.assignee = login
                        github.updateGithubIssue(owner, repo, token, github_num, payload)
                        analytics.task.logTaskActivity(
                          analytics.task.constants.ACTIVITY_ASSIGN,
                          moment().format('YYYY-MM-DD HH:mm:ss'),
                          user_id,
                          camelcaseKeys(result.task.toJSON())
                        )
                    })
                } else {
                    github.updateGithubIssue(owner, repo, token, github_num, payload)
                }
            })
        })
    }).catch(function(err) {
        reply(Boom.badRequest(err));
    })
}

function getTask(request, reply) {
    var task_id = request.params.task_id;
    var user_id = request.auth.credentials.user_id

    storage.findProjectOfTask(task_id).then(function(result) {
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.getTask(task_id).then(function(task) {
                reply(task);
            });
        })
    }).catch(function(err) {
        reply(Boom.badRequest(err));
    });
}

function createTask(request, reply) {
    var user_id = request.auth.credentials.user_id
    var projectId = request.payload.project_id
    accessControl.isUserPartOfProject(user_id, projectId).then(function (isPartOf) {
        if (!isPartOf) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return;
        }

        storage.createTask(request.payload).then(function(newTask) {
            socket.sendMessageToProject(request.payload.project_id, 'new_task', {
                task: newTask, sender: user_id
            });

            storage.findUserById(user_id).then(function(user) {
              storage.createSystemMessage(newTask.project_id, newTask.milestone_id,
              constants.systemMessageTypes.CREATE_TASK, {
                user: {
                  id: user.id,
                  display_name: user.display_name,
                },
                task: {
                  id: newTask.id,
                  content: newTask.content,
                },
              }).then(function(message) {
                socket.sendNewSystemMessageToProject(newTask.project_id, message)
              });
            });

            analytics.task.logTaskActivity(
              analytics.task.constants.ACTIVITY_CREATE,
              moment().format('YYYY-MM-DD HH:mm:ss'),
              request.auth.credentials.user_id,
              camelcaseKeys(newTask.toJSON())
            )

            if(request.payload.assignee_id) {
              analytics.task.logTaskActivity(
                analytics.task.constants.ACTIVITY_ASSIGN,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                request.payload.assignee_id,
                camelcaseKeys(newTask.toJSON())
              )
            }

            reply(newTask);
            if (!request.payload.github_token|| !request.payload.isGithubIssue) return

            storage.findProjectOfTask(newTask.id).then(function(result) {
                var project = result.project
                // Add the same task to github issues
                var owner = project.github_repo_owner
                var repo = project.github_repo_name
                var promises = []
                if (request.payload.assignee_id) {
                    promises.push(storage.findGithubLogin(request.payload.assignee_id))
                }
                var issue = {
                    title: request.payload.content
                }
                if (request.payload.assignee_id) {
                    Promise.all(promises).then(function(a) {
                        if (request.payload.assignee_id) {
                            issue.assignee = a[0]
                        }
                        if(request.payload.milestone_id) {
                          analytics.milestone.logMilestoneActivity(
                              analytics.milestone.constants.ACTIVITY_TASK_ASSIGNED,
                              moment().format('YYYY-MM-DD HH:mm:ss'),
                              user_id,
                              {projectId: project.id, id: request.payload.milestone_id}
                          )
                        }

                        github.createGithubIssue(newTask.id, issue, owner, repo, request.payload.github_token).then(function() {},
                            function(err) {
                                console.log(err)
                            })
                    }, function(err) {
                        console.log(err)
                    })
                } else {
                    github.createGithubIssue(newTask.id, issue, owner, repo, request.payload.github_token)
                }
            })

        }, function(error) {
            reply(Boom.badRequest(error));
        }); //storage.createTask
    })
}

function markTaskAsDone(request, reply) {
    var project_id = request.payload.project_id
    var task_id = request.payload.task_id;
    var token = request.payload.github_token
    var user_id = request.auth.credentials.user_id

    storage.findProjectOfTask(task_id).then(function(result) {
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.markDone(task_id).then(function () {
                storage.findUserById(user_id).then(function(user) {
                  storage.createSystemMessage(result.task.project_id, result.task.milestone_id,
                  constants.systemMessageTypes.MARK_TASK_AS_DONE, {
                    user: {
                      id: user.id,
                      display_name: user.display_name,
                    },
                    task: {
                      id: result.task.id,
                      content: result.task.content,
                    },
                  }).then(function(message) {
                    socket.sendNewSystemMessageToProject(result.task.project_id, message)
                  }, function(err) {
                    console.error('store fail to create message');
                    console.error(err);
                  });
                });
                analytics.task.logTaskActivity(
                  analytics.task.constants.ACTIVITY_DONE,
                  moment().format('YYYY-MM-DD HH:mm:ss'),
                  user_id,
                  camelcaseKeys(result.task.toJSON())
                )
                socket.sendMessageToProject(project_id, 'mark_done', {
                    task_id: task_id, sender: user_id
                })
                reply({status: constants.STATUS_OK});
                if (!request.payload.github_token) return
                // Add the same task to github issues
                var owner = project.github_repo_owner
                var repo = project.github_repo_name

                storage.findGithubIssueNumber(task_id).then(function(number) {
                    github.updateGithubIssue(owner, repo, token, number, {state: 'closed'})
                }, function (err) {
                    if (err != constants.NO_GITHUB_NUMBER) {
                        console.log(err)
                    }
                })
            });
        })
    }).catch(function(err) {
        reply(Boom.badRequest(err));
    });
}

function deleteTask(request, reply) {
    var user_id = request.auth.credentials.user_id
    var task_id = request.params.task_id;
    storage.findProjectOfTask(task_id).then(function(result) {
        var project = result.project
        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            storage.deleteTask(task_id).then(function() {
                analytics.task.logTaskActivity(
                  analytics.task.constants.ACTIVITY_DELETE,
                  moment().format('YYYY-MM-DD HH:mm:ss'),
                  user_id,
                  camelcaseKeys(result.task.toJSON())
                )
                storage.findUserById(user_id).then(function(user) {
                  storage.createSystemMessage(result.task.project_id, result.task.milestone_id,
                  constants.systemMessageTypes.DELETE_TASK, {
                    user: {
                      id: user.id,
                      display_name: user.display_name,
                    },
                    task: {
                      id: result.task.id,
                      content: result.task.content,
                    },
                  }).then(function(message) {
                    socket.sendNewSystemMessageToProject(result.task.project_id, message)
                  }, function(err) {
                    console.error('store fail to create message');
                    console.error(err);
                  });
                });
                socket.sendMessageToProject(request.payload.project_id, 'delete_task', {
                    task_id: task_id, sender: user_id
                })
                reply({
                    status: constants.STATUS_OK
                });
            });
        });
    }).catch(function(err) {
        reply(Boom.badRequest(err));
    });
}
