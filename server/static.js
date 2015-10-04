module.exports = {
    getPublic: {
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
