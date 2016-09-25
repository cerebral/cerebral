var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var loaders = [
  {
    "test": /\.js?$/,
    "exclude": /node_modules/,
    "loader": "babel",
    "query": {
      "presets": [
        "es2015",
        "react"
      ],
      "plugins": ["inferno"]
    }
  }
];

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve('demo', 'main.js'),
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('demo', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    })
  ],
  resolve: {
    alias: {
      'cerebral': path.resolve('src')
    }
  },
  module: {
    loaders: loaders
  }
};
