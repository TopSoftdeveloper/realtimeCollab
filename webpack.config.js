// Webpack config file
var webpack = require('webpack');

module.exports = {
    entry: {
        home: './assets/home/js/home.js',
        app: './assets/app/js/index.jsx'
    },
    output: {
        path: __dirname + '/assets',
        filename: '[name]-bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel']
            }
        ]
    }
};