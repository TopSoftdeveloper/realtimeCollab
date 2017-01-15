const client_config = require('config').get('client_config')

module.exports = {
    getPublic: {
        auth: false,
        handler: {
            directory: {
                path: './',
                redirectToSlash: true
            }
        }
    },
    app: {
        auth: false,
        handler:
            function(request, reply) {
              reply.view('Default.jsx')
            }

    },
    images: {
        auth: false,
        handler: {
            file: function (request) {
                return './assets/images/' + request.params.filename;
            }
        }
    },
    index: {
        auth: false,
        handler:
          function(request, reply) {
            reply.view('login.html', {google_client_id: client_config.google_client_id, hostname: client_config.hostname}).state('config', JSON.stringify(client_config));
          }

    }
};
