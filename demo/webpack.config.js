var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var loaders = [
  {
    "test": /\.js?$/,
    "exclude": /node_modules/,
    "loader": "babel",
    "query": {
      "presets": [
        "es2015",
        "react"
      ]
    }
  }
]

module.exports = {
  devtool: '#inline-source-map',
  entry: path.resolve('demo', 'main.js'),
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/'
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
}
