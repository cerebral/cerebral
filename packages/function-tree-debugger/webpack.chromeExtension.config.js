const path = require('path')
const config = {
  entry: './src/index',
  module: {
    loaders: [{
      test: /\.js?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style!css-loader'
    }, {
      test: /\.(png|woff)$/,
      loader: 'url-loader?limit=100000'
    }]
  },
  output: {
    path: path.resolve('chromeExtension', 'build'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      connector: path.resolve('connectors', 'chromeExtension.js')
    }
  }
}

module.exports = config
