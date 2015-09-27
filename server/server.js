var Hapi = require('hapi');
var Good = require('good');
var storage = require('./data/storage');
var Joi = require('joi');
var constants = require('./constants');
var format = require('string-format');

// Create a server with a host and port
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 4000
});

server.register([require('vision'), require('inert')], function (err) {

    if (err) {
        console.log('Failed to load vision.');
    }

    server.views({
        engines: {
            jsx: require('hapi-react-views')
        },
        relativeTo: __dirname,
        path: 'views'
    });

    // Add a route to serve static assets (CSS, JS, IMG)
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './'
            }
        }
    });

    // Add main app route
    server.route({
        method: 'GET',
        path: '/',
        handler: {
            view: 'Default'
        }
    });

    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log(__dirname);
        console.log('Server is listening at ' + server.info.uri);
    });
});

function createTask(request, reply) {
    var task = {
        content: request.payload.content,
        deadline: request.payload.deadline,
        is_time_specified: request.payload.is_time_specified,
        milestone_id: request.payload.milestone_id,
        project_id: request.payload.project_id
    };
    storage.createTask(task).then(function(id) {
        task.id = id;
        reply(task);
    }, function(error) {
        reply({
            error: error
        });
    });
}

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
        reply({
            error: error
        });
    });
}

function deleteTask(request, reply) {
    var task_id = request.payload.task_id;

    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply({
                status: constants.STATUS_FAIL,
                error: format(constants.TASK_NOT_EXIST, task_id)
            });
        } else {
            storage.deleteTask(task_id).then(function() {
                reply({
                    status: constants.STATUS_OK
                });
            });
        }
    });
}

server.route({
    method: 'POST',
    path: '/create_task',
    config: {
        handler: createTask,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                content: Joi.string().required(),
                deadline: Joi.string().isoDate().default(null),
                is_time_specified: Joi.boolean().default(false),
                milestone_id: Joi.string().default(null),
                project_id: Joi.string().required()
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/create_milestone',
    config: {
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
    }
});

server.route({
    method: 'POST',
    path: '/delete_task',
    config: {
        handler: deleteTask,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                task_id: Joi.string().required()
            }
        }
    }
});