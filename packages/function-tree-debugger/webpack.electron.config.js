const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')
const path = require('path')

const plugins = []
if (process.env.NODE_ENV !== 'production') {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

const config = {
  entry: (
    process.env.NODE_ENV === 'production' ? [] : ['webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr']
  ).concat([
    './src/index'
  ]),
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
    path: path.resolve('electron', 'build'),
    publicPath: 'http://localhost:9000/dist/',
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      connector: path.resolve('connectors', 'electron.js')
    }
  },
  plugins: plugins
}

config.target = webpackTargetElectronRenderer(config)

module.exports = config
