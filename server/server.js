var Hapi = require('hapi');
var Good = require('good');
var storage = require('./data/storage');
var constants = require('./constants');
var format = require('string-format');
var Routes = require('./routes');
var config = require('config');
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

    server.auth.default('token');

    server.views({
        engines: {
            jsx: require('hapi-react-views'),
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'views'
    });

    server.route(Routes.endpoints);


    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log(__dirname);
        console.log('Server is listening at ' + server.info.uri);
    });
});