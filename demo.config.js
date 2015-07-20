var path = require('path');
var isProduction = process.env.NODE_ENV === 'production';
var node_modules = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, 'demo/main.js'),
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'todomvc.js'
  },
  resolve: {
    alias: {
      'cerebral': path.resolve(__dirname, 'src', 'index.js')
    }
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.js$/,
      loader: 'babel?optional=es7.decorators',
      exclude: node_modules
    }]
  }
};

module.exports = config;
