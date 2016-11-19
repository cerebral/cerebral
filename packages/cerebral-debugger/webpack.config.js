const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')

let entry
let output
let connector
if (process.env.DEBUGGER_TARGET === 'electron') {
  entry = (
    process.env.NODE_ENV === 'production' ? [] : ['webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr']
  ).concat([
    './src/index'
  ])
  output = {
    path: __dirname + '/build',
    publicPath: 'http://localhost:9000/dist/',
    filename: 'bundle.js'
  }
  connector = __dirname + '/connectors/electron.js'
} else {
  entry = (
    process.env.NODE_ENV === 'production' ? [] : ['webpack-hot-middleware/client?reload=true&path=http://localhost:3000/__webpack_hmr']
  ).concat([
    './src/index'
  ])
  output = {
    path: __dirname + '/chromeExtension/build',
    publicPath: '/dist',
    filename: 'bundle.js'
  }
  connector = __dirname + '/connectors/chrome.js'
}

const plugins = []
if (process.env.NODE_ENV !== 'production') {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

const config = {
  entry: entry,
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
  output: output,
  resolve: {
    alias: {
      connector: connector
    }
  },
  plugins: plugins
};

if (process.env.DEBUGGER_TARGET === 'electron') {
  config.target = webpackTargetElectronRenderer(config);
}

module.exports = config;
