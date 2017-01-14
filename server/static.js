
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
              reply.view('Default.jsx').state('config', JSON.stringify(require('config').get('client_config')));
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
        handler: {
            view: {
                template: 'index.html',
                context: {
                    title: 'NUSCollab',
                    header: 'Collaborate with your project mates with ease'
                }
            }
        }
    }
};
