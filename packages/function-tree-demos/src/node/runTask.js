'use strict'

const FunctionTree = require('function-tree')
const NodeDebuggerProvider = require('function-tree/lib/providers/NodeDebugger')
const ContextProvider = require('function-tree/lib/providers/Context')
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
