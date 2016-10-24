'use strict'

const FunctionTree = require('function-tree')
const NodeDebuggerProvider = require('function-tree/providers').NodeDebuggerProvider
const ContextProvider = require('function-tree/providers').ContextProvider
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
