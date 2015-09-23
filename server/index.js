var Hapi = require('hapi');
var Good = require('good');
var storage = require('./data/storage');
var Joi = require('joi');


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
        milestone_id: request.payload.milestone_id
    };
    storage.createTask(task).then(function(id) {
        task.id = id;
        reply(task);
    }, function(error) {
        reply(error);
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
                milestone_id: Joi.string().default(null)
            }
        }
    }
});