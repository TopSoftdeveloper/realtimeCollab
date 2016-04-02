var Handlers = require('./handlers');

exports.register = function (server, options, next) {
    var io = require('socket.io')(server.select('collaboration').listener);
    io.on('connection', function (socket) {
        socket.on('is_online', Handlers.is_online.bind(null, socket));
        socket.on('disconnect', Handlers.is_offline.bind(null, socket));
        socket.on('is_editing', Handlers.editing_status.bind(null, socket, 'is_editing'));
        socket.on('stop_editing', Handlers.editing_status.bind(null, socket, 'stop_editing'));
    });

    exports.io = io;

    next();
};

exports.register.attributes = {
    name: 'collaboration'
};