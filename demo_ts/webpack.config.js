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
      ]
      //"plugins": ["inferno"]
    }
  },
  {
    test: /\.tsx?$/,
    loaders: ['babel-loader?presets[]=react,presets[]=es2015', 'ts-loader?silent=true'],
    exclude: /node_modules/
  }
];

module.exports = {
  devtool: '#inline-source-map',
  entry: path.resolve('demo_ts', 'main.tsx'),
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('demo_ts', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    })
  ],
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    alias: {
      'cerebral': path.resolve('src')
    }
  },
  module: {
    loaders: loaders
  }
};
