var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var socket = require('./socket/handlers');
var helper = require('../utils/helper');
var config = require('config');
var Jwt = require('jsonwebtoken');

var secret_key = config.get('authentication.privateKey');

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
                milestone_id: Joi.default(null)
            }
        }
    },
    getTask: {
        handler: getTasks
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
        },
        validate: {
            payload: {
                task_id: Joi.string().required(),
                project_id: Joi.string().required()
            }
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
    var payload = request.payload
    storage.updateTask(payload, task_id).then(function() {
            reply({
                status: constants.STATUS_OK
            });
    })
}

function getTaskById(task_id, reply) {
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
        } else {
            storage.getTask(task_id).then(function(task) {
                reply({
                    status: constants.STATUS_OK,
                    tasks: [task]
                });
            });
        }
    });
}

function getTasks(request, reply) {
    var task_id = request.params.task_id;
    if (task_id === null) {
        storage.getAllTasks().then(function(tasks) {
            reply({
                status: constants.STATUS_OK,
                tasks: tasks
            })
        });
    } else {
        getTaskById(task_id, reply);
    }
}

function createTask(request, reply) {
    var task = {
        content: request.payload.content,
        milestone_id: request.payload.milestone_id,
        completed_on: null,
        project_id: request.payload.project_id
    };
    storage.createTask(task).then(function(newTask) {
        Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
            socket.sendMessageToProject(request.payload.project_id, 'new_task', {
                task: newTask, sender: decoded.user_id
            })
        });
        reply(newTask);                
    }, function(error) {
        reply(Boom.badRequest(error));
    });
}

function markTaskAsDone(request, reply) {
    var task_id = request.payload.task_id;
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
        } else {
            storage.markDone(task_id).then(function() {               
                Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
                    socket.sendMessageToProject(request.payload.project_id, 'mark_done', {
                        task_id: task_id, sender: decoded.user_id
                    })
                });    
                reply({
                    status: constants.STATUS_OK
                });                               
            });
        }
    });
}

function deleteTask(request, reply) {
    var task_id = request.params.task_id;
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply(Boom.badRequest(format(constants.TASK_NOT_EXIST, task_id)));
        } else {
            storage.deleteTask(task_id).then(function() {
                Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
                    socket.sendMessageToProject(request.payload.project_id, 'delete_task', {
                        task_id: task_id, sender: decoded.user_id
                    })
                });    
                reply({
                    status: constants.STATUS_OK
                });                              
            });
        }
    });
}