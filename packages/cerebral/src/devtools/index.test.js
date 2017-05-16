/* eslint-env mocha */
'use strict'

import assert from 'assert'
import {state, signal} from '../tags'
import {Container, connect} from '../viewFactories/react'
import { WebSocket, Server } from 'mock-socket'
import {Devtools} from './'
import Controller from '../Controller'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
const version = VERSION // eslint-disable-line
import {FunctionTreeExecutionError} from 'function-tree/lib/errors'

Devtools.prototype.createSocket = function () {
  this.ws = new WebSocket(`ws://${this.remoteDebugger}`)
}

describe('Devtools', () => {
  it('should throw when remoteDebugger is not set', () => {
    assert.throws(() => {
      new Devtools() // eslint-disable-line no-new
    }, (err) => {
      if (err instanceof Error) {
        return err.message === 'Devtools: You have to pass in the "remoteDebugger" option'
      }
    })
  })
  it('should init correctly and work when debugger is open when app loads', (done) => {
    const mockServer = new Server('ws://localhost:8585')
    let messages = []
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        messages.push(message.type)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
        }
      })
    })
    const controller = new Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585',
        reconnect: true
      })
    })
    assert.equal(controller.devtools.isConnected, false)
    setTimeout(() => {
      assert.deepEqual(messages, ['ping', 'init', 'components'])
      assert.equal(controller.devtools.isConnected, true)
      assert.equal(controller.devtools.reconnectInterval, 5000)
      assert.equal(controller.devtools.doReconnect, true)
      assert.deepEqual(controller.devtools.debuggerComponentsMap, {})
      assert.equal(controller.devtools.debuggerComponentDetailsId, 1)
      assert.equal(controller.devtools.storeMutations, true)
      assert.equal(controller.devtools.preventExternalMutations, true)
      assert.equal(controller.devtools.preventPropsReplacement, false)
      assert.equal(controller.devtools.bigComponentsWarning, 10)

      assert.deepEqual(controller.devtools.controller, controller)
      assert.deepEqual(controller.devtools.originalRunTreeFunction, controller.run)
      assert.equal(controller.devtools.isResettingDebugger, false)
      assert.equal(controller.devtools.initialModelString, JSON.stringify(controller.model.get()))
      mockServer.stop(done)
    }, 70)
  })
  /* it.only('should work when Debugger is opened after app load', (done) => {

    let messages = []

    const devtools = new Devtools({
      remoteDebugger: 'localhost:8585',
      reconnectInterval: 800
    })
    setTimeout(() => {
      const mockServer = new Server('ws://localhost:8585')
      mockServer.on('connection', (server) => {
        server.on('message', (event) => {
          const message = JSON.parse(event)
          messages.push(message.type)
          switch (message.type) {
            case 'pong':
              server.send(JSON.stringify({type: 'ping'}))
              break
            case 'ping':
              server.send(JSON.stringify({type: 'pong'}))
              break
          }
        })
      })
    }, 10)

    setTimeout(() => {
      assert.deepEqual(messages, ['pong', 'init'])
      assert.equal(devtools.isConnected, true)
      mockServer.stop(done);
    }, 1500);
  }) */
  it('should warn and try to reconnect to Debugger', (done) => {
    let warnCount = 0
    const originWarn = console.warn
    console.warn = function (...args) {
      warnCount++
      assert.equal(args[0], 'Debugger application is not running on selected port... will reconnect automatically behind the scenes')
      originWarn.apply(this, args)
    }
    const controller = new Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585',
        reconnectInterval: 500
      })
    })
    assert.equal(controller.devtools.isConnected, false)
    let mockServer
    let messages = []
    setTimeout(() => {
      mockServer = new Server('ws://localhost:8585')
      mockServer.on('connection', (server) => {
        server.on('message', (event) => {
          const message = JSON.parse(event)
          messages.push(message.type)
          switch (message.type) {
            case 'pong':
              server.send(JSON.stringify({type: 'ping'}))
              break
            case 'ping':
              server.send(JSON.stringify({type: 'pong'}))
              break
          }
        })
      })
    }, 400)

    setTimeout(() => {
      assert.deepEqual(messages, ['ping', 'init', 'components'])
      assert.equal(warnCount, 1)
      assert.equal(controller.devtools.isConnected, true)
      console.warn = originWarn
      mockServer.stop(done)
    }, 1050)
  })
  it('should set component details and watch executions', (done) => {
    const mockServer = new Server('ws://localhost:8585')
    let messages = {}
    let messageTypes = []
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
          case 'init':
            break
          case 'execution':
            messageTypes.push(message.type)
            if (Array.isArray(messages[message.type])) {
              messages[message.type].push(message)
            } else {
              messages[message.type] = [message]
            }
            break
          default:
            messageTypes.push(message.type)
            messages[message.type] = message
            break
        }
      })
    })
    function actionA ({path, state}) {
      assert.ok(true)
      state.set('foo', 'foo')
      return path.success()
    }
    function actionB () {
      assert.ok(true)
      return { bar: 'baz' }
    }

    const controller = Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585'
      }),
      state: {
        foo: 'bar',
        bar: 'foo'
      },
      signals: {
        test: [
          actionA, {
            success: [
              actionB
            ]
          }
        ]
      }
    })
    const TestComponent = connect({
      foo: state`foo`,
      bar: state`bar`,
      test: signal`test`
    }, (props) => {
      return (
        <div>{props.foo}</div>
      )
    })
    TestComponent.displayName = 'TestComponent'
    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))
    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')

    setTimeout(() => {
      assert.deepEqual(messageTypes, ['components'])
      assert.equal(controller.devtools.isConnected, true)

      assert.deepEqual(controller.devtools.debuggerComponentsMap.foo, [{ name: 'TestComponent', renderCount: 0, id: 1 }])
      assert.deepEqual(controller.devtools.debuggerComponentsMap.bar, [{ name: 'TestComponent', renderCount: 0, id: 1 }])
      assert.equal(controller.devtools.debuggerComponentsMap.test, undefined)

      assert.equal(messages.components.source, 'c')
      assert.deepEqual(messages.components.data.map.foo, [{ name: 'TestComponent', renderCount: 0, id: 1 }])
      assert.deepEqual(messages.components.data.map.bar, [{ name: 'TestComponent', renderCount: 0, id: 1 }])
      assert.deepEqual(messages.components.data.render, { components: [] })

      controller.getSignal('test')({
        foo: 'bar'
      })

      assert.deepEqual(controller.devtools.debuggerComponentsMap.foo, [{ name: 'TestComponent', renderCount: 1, id: 1 }])
      assert.deepEqual(controller.devtools.debuggerComponentsMap.bar, [{ name: 'TestComponent', renderCount: 1, id: 1 }])
      assert.equal(controller.devtools.debuggerComponentsMap.test, undefined)

      assert.deepEqual(messageTypes, ['components', 'executionStart', 'execution', 'execution', 'executionPathStart', 'execution', 'executionFunctionEnd', 'executionEnd'])
      assert.ok(messages.executionStart.data.execution)
      assert.equal(messages.executionStart.source, 'c')

      assert.equal(messages.execution.length, 3)
      assert.ok(messages.execution[0].data.execution)
      assert.equal(messages.execution[0].source, 'c')
      assert.equal(messages.execution[0].version, version)
      assert.deepEqual(messages.execution[0].data.execution.payload, { foo: 'bar' })

      assert.ok(messages.execution[1].data.execution)
      assert.equal(messages.execution[1].source, 'c')
      assert.equal(messages.execution[1].version, version)
      assert.deepEqual(messages.execution[1].data.execution.payload, { foo: 'bar' })
      assert.equal(messages.execution[1].data.execution.data.method, 'set')
      assert.deepEqual(messages.execution[1].data.execution.data.args, [ [ 'foo' ], 'foo' ])
      assert.equal(messages.execution[1].data.execution.data.type, 'mutation')
      assert.equal(messages.execution[1].data.execution.data.color, '#333')

      assert.ok(messages.executionPathStart.data.execution)
      assert.equal(messages.executionPathStart.source, 'c')
      assert.equal(messages.executionPathStart.version, version)
      assert.equal(messages.executionPathStart.data.execution.path, 'success')

      assert.ok(messages.execution[2].data.execution)
      assert.equal(messages.execution[2].source, 'c')
      assert.equal(messages.execution[2].version, version)
      assert.deepEqual(messages.execution[2].data.execution.payload, { foo: 'bar' })

      assert.ok(messages.executionFunctionEnd.data.execution)
      assert.equal(messages.executionFunctionEnd.source, 'c')
      assert.equal(messages.executionFunctionEnd.version, version)
      assert.deepEqual(messages.executionFunctionEnd.data.execution.output, { bar: 'baz' })

      assert.ok(messages.executionEnd.data.execution)
      assert.equal(messages.executionEnd.version, version)
      assert.equal(messages.executionEnd.source, 'c')
      mockServer.stop(done)
    }, 70)
  })
  it('should watch signal execution error', (done) => {
    const mockServer = new Server('ws://localhost:8585')
    let messages = {}
    let messageTypes = []
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
          case 'init':
            break
          case 'execution':
            messageTypes.push(message.type)
            if (Array.isArray(messages[message.type])) {
              messages[message.type].push(message)
            } else {
              messages[message.type] = [message]
            }
            break
          default:
            messageTypes.push(message.type)
            messages[message.type] = message
            break
        }
      })
    })
    function actionA () {
      return {
        foo: 'bar'
      }
    }
    let errorCount = 0
    const controller = Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585'
      }),
      state: {
        foo: 'bar',
        bar: 'foo'
      },
      signals: {
        test: [
          actionA, {
            success: []
          }
        ]
      },
      catch: new Map([
        [FunctionTreeExecutionError, [
          ({props}) => {
            errorCount++
            assert.ok(props.error.message.match(/needs to be a path of either success/))
          }
        ]]
      ])
    })
    const TestComponent = connect({
      foo: state`foo`,
      bar: state`bar`,
      test: signal`test`
    }, (props) => {
      return (
        <div>{props.foo}</div>
      )
    })
    TestComponent.displayName = 'TestComponent'
    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))
    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')

    setTimeout(() => {
      controller.getSignal('test')()
      assert.equal(errorCount, 1)
      assert.deepEqual(messageTypes, ['components', 'components', 'executionStart', 'execution', 'executionFunctionError', 'executionStart', 'execution', 'executionEnd'])
      mockServer.stop(done)
    }, 70)
  })
  it('should reset the state', (done) => {
    const mockServer = new Server('ws://localhost:8585')
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
          default:
            break
        }
      })
      setTimeout(() => {
        server.send(JSON.stringify({type: 'reset'}))
      }, 150)
    })
    function actionA ({path, state}) {
      state.set('foo', 'foo')
      return path.success()
    }
    function actionB () {
      return { bar: 'baz' }
    }

    const controller = Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585'
      }),
      state: {
        foo: 'bar',
        bar: 'foo'
      },
      signals: {
        test: [
          actionA, {
            success: [
              actionB
            ]
          }
        ]
      }
    })
    const TestComponent = connect({
      foo: state`foo`,
      bar: state`bar`,
      test: signal`test`
    }, (props) => {
      return (
        <div>{props.foo}</div>
      )
    })
    TestComponent.displayName = 'TestComponent'
    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))
    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')

    setTimeout(() => {
      assert.deepEqual(JSON.parse(controller.devtools.initialModelString), {
        foo: 'bar',
        bar: 'foo'
      })
      assert.equal(controller.devtools.isConnected, true)

      assert.deepEqual(controller.devtools.debuggerComponentsMap.foo, [{ name: 'TestComponent', renderCount: 0, id: 1 }])
      assert.deepEqual(controller.devtools.debuggerComponentsMap.bar, [{ name: 'TestComponent', renderCount: 0, id: 1 }])
      assert.equal(controller.devtools.debuggerComponentsMap.test, undefined)

      controller.getSignal('test')({
        foo: 'bar'
      })
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'foo'
      })
      assert.deepEqual(JSON.parse(controller.devtools.initialModelString), {
        foo: 'bar',
        bar: 'foo'
      })
      assert.deepEqual(controller.devtools.debuggerComponentsMap.foo, [{ name: 'TestComponent', renderCount: 1, id: 1 }])
      assert.deepEqual(controller.devtools.debuggerComponentsMap.bar, [{ name: 'TestComponent', renderCount: 1, id: 1 }])
      assert.equal(controller.devtools.debuggerComponentsMap.test, undefined)
    }, 70)

    setTimeout(() => {
      assert.deepEqual(controller.model.state, JSON.parse(controller.devtools.initialModelString))
      assert.deepEqual(controller.devtools.backlog, [])
      assert.deepEqual(controller.devtools.mutations, [])
      assert.equal(controller.devtools.debuggerComponentsMap.test, undefined)
      mockServer.stop(done)
    }, 300)
  })
  it('should warn when remember message sent if storeMutations option is false', (done) => {
    let warnCount = 0
    const originWarn = console.warn
    console.warn = function (...args) {
      warnCount++
      assert.equal(args[0], 'Cerebral Devtools - You tried to time travel, but you have turned of storing of mutations')
      originWarn.apply(this, args)
    }
    const mockServer = new Server('ws://localhost:8585')
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
        }
      })
      setTimeout(() => {
        server.send(JSON.stringify({type: 'remember', data: 0}))
      }, 70)
    })
    const controller = new Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585',
        reconnect: true,
        storeMutations: false
      })
    })
    setTimeout(() => {
      assert.equal(warnCount, 1)
      assert.equal(controller.devtools.storeMutations, false)
      console.warn = originWarn
      mockServer.stop(done)
    }, 100)
  })
  it('should travel back in time', (done) => {
    const mockServer = new Server('ws://localhost:8585')
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
        }
      })
      setTimeout(() => {
        server.send(JSON.stringify({type: 'remember', data: 1}))
      }, 200)
      setTimeout(() => {
        server.send(JSON.stringify({type: 'remember', data: 0}))
      }, 400)
      setTimeout(() => {
        server.send(JSON.stringify({type: 'remember', data: 1}))
      }, 600)
    })
    function actionA ({state}) {
      state.set('foo', 'foo')
    }
    function actionB ({state}) {
      state.set('bar', 'bar')
    }

    const controller = Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585'
      }),
      state: {
        foo: 'bar',
        bar: 'foo'
      },
      signals: {
        testA: [
          actionA
        ],
        testB: [
          actionB
        ]
      }
    })
    let rememberCount = 0
    controller.on('remember', (datetime) => {
      rememberCount++
    })

    const TestComponent = connect({
      foo: state`foo`,
      bar: state`bar`
    }, (props) => {
      return (
        <div>{props.foo}</div>
      )
    })
    TestComponent.displayName = 'TestComponent'
    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))
    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')

    setTimeout(() => {
      assert.deepEqual(JSON.parse(controller.devtools.initialModelString), {
        foo: 'bar',
        bar: 'foo'
      })
      assert.equal(controller.devtools.isConnected, true)

      controller.getSignal('testA')()
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'foo'
      })
      controller.getSignal('testB')()
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'bar'
      })
      assert.deepEqual(JSON.parse(controller.devtools.initialModelString), {
        foo: 'bar',
        bar: 'foo'
      })
      assert.deepEqual(controller.devtools.debuggerComponentsMap.foo, [{ name: 'TestComponent', renderCount: 2, id: 1 }])
      assert.deepEqual(controller.devtools.debuggerComponentsMap.bar, [{ name: 'TestComponent', renderCount: 2, id: 1 }])
      assert.equal(controller.devtools.debuggerComponentsMap.test, undefined)
      assert.equal(controller.devtools.mutations.length, 2)
      assert.equal(rememberCount, 0)
    }, 70)

    setTimeout(() => {
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'foo'
      })
      assert.equal(controller.devtools.mutations.length, 2)
      assert.equal(rememberCount, 1)
    }, 300)
    setTimeout(() => {
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'bar'
      })
      assert.equal(controller.devtools.mutations.length, 2)
      assert.equal(rememberCount, 2)
    }, 500)
    setTimeout(() => {
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'foo'
      })
      assert.equal(controller.devtools.mutations.length, 2)
      assert.equal(rememberCount, 3)

      mockServer.stop(done)
    }, 800)
  })
  it('should warn when the signal fired while debugger is remembering state', (done) => {
    let warnCount = 0
    const originWarn = console.warn
    console.warn = function (...args) {
      warnCount++
      assert.equal(args[0], 'The signal "testB" fired while debugger is remembering state, it was ignored')
      originWarn.apply(this, args)
    }
    const mockServer = new Server('ws://localhost:8585')
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
        }
      })
      setTimeout(() => {
        server.send(JSON.stringify({type: 'remember', data: 1}))
      }, 150)
    })
    function actionA ({state}) {
      state.set('foo', 'foo')
    }
    function actionB ({state}) {
      state.set('bar', 'bar')
    }

    const controller = Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585'
      }),
      state: {
        foo: 'bar',
        bar: 'foo'
      },
      signals: {
        testA: [
          actionA
        ],
        testB: [
          actionB
        ]
      }
    })
    const TestComponent = connect({
      foo: state`foo`,
      bar: state`bar`
    }, (props) => {
      return (
        <div>{props.foo}</div>
      )
    })
    TestComponent.displayName = 'TestComponent'
    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))
    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')

    setTimeout(() => {
      assert.deepEqual(JSON.parse(controller.devtools.initialModelString), {
        foo: 'bar',
        bar: 'foo'
      })
      assert.equal(controller.devtools.isConnected, true)

      controller.getSignal('testA')()
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'foo'
      })
      controller.getSignal('testB')()
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'bar'
      })
      assert.deepEqual(JSON.parse(controller.devtools.initialModelString), {
        foo: 'bar',
        bar: 'foo'
      })
      assert.deepEqual(controller.devtools.debuggerComponentsMap.foo, [{ name: 'TestComponent', renderCount: 2, id: 1 }])
      assert.deepEqual(controller.devtools.debuggerComponentsMap.bar, [{ name: 'TestComponent', renderCount: 2, id: 1 }])
      assert.equal(controller.devtools.debuggerComponentsMap.test, undefined)
      assert.equal(controller.devtools.mutations.length, 2)
    }, 70)

    setTimeout(() => {
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'foo'
      })
      assert.equal(controller.devtools.mutations.length, 2)
      controller.getSignal('testB')()
      assert.deepEqual(controller.model.state, {
        foo: 'foo',
        bar: 'foo'
      })

      assert.equal(warnCount, 1)
      console.warn = originWarn
      mockServer.stop(done)
    }, 300)
  })
  it('should change model state when debugger model state changed', (done) => {
    const mockServer = new Server('ws://localhost:8585')
    mockServer.on('connection', (server) => {
      server.on('message', (event) => {
        const message = JSON.parse(event)
        switch (message.type) {
          case 'pong':
            server.send(JSON.stringify({type: 'ping'}))
            break
          case 'ping':
            server.send(JSON.stringify({type: 'pong'}))
            break
        }
      })
      setTimeout(() => {
        server.send(JSON.stringify({type: 'changeModel', data: {path: [ 'foo' ], value: 'baz'}}))
      }, 70)
    })

    const controller = Controller({
      devtools: new Devtools({
        remoteDebugger: 'localhost:8585'
      }),
      state: {
        foo: 'bar',
        bar: 'foo'
      }
    })
    const TestComponent = connect({
      foo: state`foo`,
      bar: state`bar`
    }, (props) => {
      return (
        <div>{props.foo}</div>
      )
    })
    TestComponent.displayName = 'TestComponent'
    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))
    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')

    setTimeout(() => {
      assert.deepEqual(controller.model.state, {
        foo: 'baz',
        bar: 'foo'
      })
      mockServer.stop(done)
    }, 100)
  })
})
