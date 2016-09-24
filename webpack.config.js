const path = require('path');

module.exports = {
  entry: {
    'index': path.resolve('src', 'index.js'),
    'operators/index': path.resolve('src', 'operators', 'index.js'),
    'router/index': path.resolve('src', 'router', 'index.js'),
    'devtools/index': path.resolve('src', 'devtools', 'index.js'),
    'react/index': path.resolve('src', 'react', 'index.js')
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
      'cerebral': path.resolve('src', 'cerebral')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'es2015'
          ]
        }
      }
    ]
  }
};
