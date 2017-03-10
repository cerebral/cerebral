const webpack = require('webpack')
const path = require('path')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })
]
if (process.env.NODE_ENV !== 'production') {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

const config = {
  target: 'electron-renderer',
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
      connector: path.resolve('connector', 'index.js')
    }
  },
  plugins: plugins
}

module.exports = config
