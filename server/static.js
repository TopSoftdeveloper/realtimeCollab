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
        handler: {
            view: 'Default.jsx'
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
