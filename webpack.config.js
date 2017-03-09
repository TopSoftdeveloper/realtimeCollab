// Webpack config file
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: './assets/app/js/index.jsx',
  },
  output: {
    path: __dirname + '/assets',
    filename: '[name]-bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  plugins: [new webpack.OldWatchingPlugin()],
  externals: {
    cheerio: 'window',
    'react-addons-test-utils': true,
  },
};
