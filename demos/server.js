const path = require('path');
const express = require('express');
const app = express();
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const bodyParser = require('body-parser');
const argv = require('minimist')(process.argv.slice(2));

const config = {
  entry: path.resolve('demos', argv.demo, 'main.js'),
  output: {
    path: path.resolve('public'),
    filename: 'main.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      include: [path.resolve('demos', argv.demo)],
      loader: require.resolve('babel-loader'),
      query: {
        presets: [
          require.resolve('babel-preset-es2015'),
          require.resolve('babel-preset-react')
        ],
        plugins: [
          // Needed by mobx
          require.resolve('babel-plugin-transform-decorators-legacy')
        ]
      }
    }, {
      test: /\.css$/,
      loader: 'style!css?modules'
    }]
  },
  resolve: {
    alias: {
      'function-tree': path.resolve()
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Demo: ' + argv.demo,
      template: path.resolve('demos', 'index.template.html'),
      inject: true
    })
  ]
};
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));
app.use(bodyParser.json());

const users = [{
  id: 1,
  name: 'Christian Alfoni',
  githubUsername: 'christianalfoni'
}, {
  id: 2,
  name: 'Aleksey tha man'
}, {
  id: 3,
  name: 'Brian Fitch'
}, {
  id: 4,
  name: 'Garth Williams'
}];

const assignments = [{
  id: 1,
  title: 'Check out function tree demos',
  assignedTo: [1]
}];

app.get('/assignments', (req, res) => {
  setTimeout(() => {
    res.send(assignments);
  }, 500);
});

app.post('/assignments', (req, res) => {
  const assignment = req.body;

  setTimeout(() => {
    assignment.id = assignments.length + 1;
    assignments.unshift(assignment);
    res.send({
      id: assignment.id
    });
  }, 500);
});

app.get('/users', (req, res) => {
  setTimeout(() => {
    res.send(users.filter(user => (
      user.name.toLowerCase().indexOf(req.query.name.toLowerCase()) === 0
    ))[0] || null);
  }, 200);
});

app.get('/users/:id', (req, res) => {
  setTimeout(() => {
    res.send(users.filter(user => user.id === Number(req.params.id))[0]);
  }, 500);
});

app.listen(3000, () => {
  console.log('Running demo: ' + argv.demo + ', on localhost:3000');
});
