var Handlers = require('./handlers');

exports.register = function (server, options, next) {
    var io = require('socket.io')(server.select('collaboration').listener);
    io.on('connection', function (socket) {
        socket.on('is_online', Handlers.is_online.bind(null, socket));
        socket.on('disconnect', Handlers.is_offline.bind(null, socket));
    });

    exports.io = io;

    next();
};

exports.register.attributes = {
    name: 'collaboration'
};