const FunctionTree = require('function-tree');
const NodeDebuggerProvider = require('function-tree/providers/NodeDebugger');
const FirebaseProvider = require('./providers/Firebase');
const DashboardProvider = require('./providers/Dashboard');

module.exports = new FunctionTree((
  process.env.NODE_ENV === 'production' ?
    []
  :
    [NodeDebuggerProvider]
).concat([
  FirebaseProvider(),
  DashboardProvider()
])
);
