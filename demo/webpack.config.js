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
  entry: path.join(__dirname, 'main.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
     host: '0.0.0.0',
     port: process.env.PORT || 3000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    })
  ],
  resolve: {
    alias: {
      'cerebral': path.join(__dirname, '../lib')
    },
    fallback: path.join(__dirname, 'node_modules')
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: loaders
  }
}
