var path = require('path')
var src = path.resolve(__dirname, 'src')
var dist = path.resolve(__dirname, 'dist')

var config = {
  entry: path.resolve(src, 'main.js'),
  devtool: 'source-map',
  output: {
    path: dist,
    filename: 'todomvc.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: src
    }]
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    fallback: path.join(__dirname, 'node_modules')
  },

  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
}

module.exports = config
