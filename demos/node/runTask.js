const FunctionTree = require('../../src')
const NodeDebuggerProvider = require('../../providers/NodeDebugger')
const ContextProvider = require('../../providers/Context')
const request = require('request')

module.exports = new FunctionTree([
  NodeDebuggerProvider({
    colors: {
      request: 'blue'
    }
  }),
  ContextProvider({
    request
  })
])
