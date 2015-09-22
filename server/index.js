var Hapi = require('hapi');
var Good = require('good');

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