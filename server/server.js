var Hapi = require('hapi');
var Good = require('good');
var storage = require('./data/storage');
var Joi = require('joi');
var constants = require('./constants');
var format = require('string-format');
var Bcrypt = require('bcrypt');
var Boom = require('boom');
var config = require('config');
var Jwt = require('jsonwebtoken');

var token_expiry = config.get('authentication.tokenExpiry');
var privateKey = config.get('authentication.privateKey');

// Create a server with a host and port
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 4000
});

var validate = function(request, decodedToken, callback) {
    var diff = Date.now() /1000 - decodedToken.iat;
    if (diff > decodedToken.expiresIn) {
        return callback(null, false);
    }
    callback(null, true, decodedToken);
};

server.register([require('vision'), require('inert'), require('hapi-auth-jwt')], function (err) {

    if (err) {
        console.log(err);
    }

    server.auth.strategy('token', 'jwt', {
        validateFunc: validate,
        key: privateKey
    });

    server.views({
        engines: {
            jsx: require('hapi-react-views'),
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'views'
    });


    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './',
                redirectToSlash: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/app',
        handler: {
            view: 'Default.jsx'
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            view: {
                template: 'index.html',
                context: {
                    title: 'NUSCollab',
                    header: 'Collaborate with your project mates with ease'
                }
            }
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
        reply({
            error: error
        });
    });
}

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

function getTaskById(task_id, reply) {
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply({
                status: constants.STATUS_FAIL,
                error: format(constants.TASK_NOT_EXIST, task_id)
            });
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
    var task_id = request.query.task_id;
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

function getMilestones(request, reply) {
    storage.getMilestonesWithTasks().then(function(milestones) {
        reply({
            status: constants.STATUS_OK,
            milestones: milestones
        })
    });
}

function markTaskAsDone(request, reply) {
    var task_id = request.payload.task_id;
    storage.doesTaskExist(task_id).then(function(exists) {
        if (!exists) {
            reply({
                status: constants.STATUS_FAIL,
                error: format(constants.TASK_NOT_EXIST, task_id)
            });
        } else {
            storage.markDone(task_id).then(function() {
                reply({
                    status: constants.STATUS_OK
                });
            });
        }
    });
}
/************************** AUTHENTICATION*************************/


function create_account(request, reply) {
    var password = request.payload.password;
    var email = request.payload.email;

    storage.doesUserExist(email).then(function(exists) {
        if (exists) {
            reply(Boom.forbidden(format(constants.EMAIL_ALREADY_EXISTS, email)));
            return;
        }

        Bcrypt.genSalt(10, function(err, salt) {
            Bcrypt.hash(password, salt, function(err, hash) {
                storage.createUser(salt, hash, email).then(function(user) {
                    reply({
                        status: constants.STATUS_OK,
                        user_id: user.id
                    });
                }, function(error) {
                    reply(Boom.forbidden(error));
                });
            });
        });

    });
}

function login(request, reply) {
    var password = request.payload.password;
    var email = request.payload.email;

    storage.findUser(email).then(function(user) {
        if (user === null) {
            reply(Boom.forbidden(constants.AUTHENTICATION_ERROR));
            return;
        }

        Bcrypt.hash(password, user.salt, function(err, hash) {
            if (hash !== user.password) {
                reply(Boom.forbidden(constants.AUTHENTICATION_ERROR));
                return;
            }

            var token_data = {
                email: user.email,
                user_id: user.id,
                expiresIn: token_expiry
            };

            reply({
                email: user.email,
                user_id: user.id,
                token: Jwt.sign(token_data, privateKey)
            });
        });

    }, function(error) {
        reply(Boom.forbidden(constants.AUTHENTICATION_ERROR));
    })
}

server.route({
    method: 'POST',
    path: '/create_account',
    config: {
        handler: create_account,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(3).required()
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/login',
    config: {
        handler: login,
        payload: {
            parse: true
        },
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(3).required()
            }
        }
    }
});
/*****************************************************************/


server.route({
    method: 'GET',
    path: '/task',
    config: {
        handler: getTasks,
        validate: {
            query: {
                task_id: Joi.string().default(null)
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/milestone',
    config: {
        auth: 'token',
        handler: getMilestones
    }
});

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
                completed_on: Joi.string().isoDate().default(null)
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
                deadline: Joi.string().isoDate().default(null)
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/mark_completed',
    config: {
        handler: markTaskAsDone,
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

server.route({
    method: 'DELETE',
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

server.route({
    method: 'DELETE',
    path: '/delete_milestone',
    config: {
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
});