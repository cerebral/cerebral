const path = require('path')

module.exports = {
  entry: path.resolve('client', 'index.js'),
  output: {
    filename: 'main.js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js?$/,
      include: [path.resolve('client')],
      use: [{
        loader: require.resolve('babel-loader')
      }]
    }]
  }
}
