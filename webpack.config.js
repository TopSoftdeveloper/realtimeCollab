// Webpack config file
module.exports = {
    entry: {
        home: './assets/home/js/home.js',
        app: './assets/app/js/components/TaskPanel.jsx'
    },
    output: {
        path: __dirname + '/assets',
        filename: '[name]-bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx$/,
                loader: 'jsx-loader'
            }
        ]
    }
};
