const FunctionTree = require('../../src')
const NodeDebuggerProvider = require('../../providers/NodeDebugger')
const ContextProvider = require('../../providers/Context')
const request = require('request')
const fs = require('fs')

module.exports = new FunctionTree([
  NodeDebuggerProvider({
    colors: {
      request: 'blue',
      fs: 'green'
    }
  }),
  ContextProvider({
    request,
    fs
  })
])
