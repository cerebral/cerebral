/* eslint-env mocha */
import Controller from './Controller'
import assert from 'assert'

describe('Controller', () => {
  it('should instantiate with initial state', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      }
    })
    assert.deepEqual(controller.getState(), {foo: 'bar'})
  })
  it('should throw error when signals are grabbed before initialized', () => {
    assert.throws(() => {
      Controller({
        signals: {
          foo: []
        },
        modules: {
          test ({controller}) {
            controller.getSignal('foo')

            return {}
          }
        }
      })
    }, /initialized/)
  })
  it('should instantiate with signals defined', () => {
    const controller = new Controller({
      signals: {
        foo: []
      }
    })
    assert.ok(controller.getSignal('foo'))
  })
  it('should instantiate providers defined', () => {
    const controller = new Controller({
      signals: {
        foo: [
          function testAction (context) {
            assert.equal(context.foo, 'bar')
          }
        ]
      },
      providers: [
        function TestProvider (context) {
          context.foo = 'bar'

          return context
        }
      ]
    })
    controller.getSignal('foo')()
  })
  it('should instantiate modules defined as objects', () => {
    const controller = new Controller({
      modules: {
        foo: {
          state: {
            foo: 'bar'
          }
        }
      }
    })
    assert.deepEqual(controller.getState(), {foo: {foo: 'bar'}})
  })
  it('should instantiate modules defined as functions', () => {
    const controller = new Controller({
      modules: {
        foo: () => ({
          state: {
            foo: 'bar'
          }
        })
      }
    })
    assert.deepEqual(controller.getState(), {foo: {foo: 'bar'}})
  })
  it('should pass instance of controller and path info on functions module instantiation', () => {
    const controller = new Controller({
      modules: {
        foo: {
          modules: {
            bar: ({controller, path, name}) => {
              assert.ok(controller)
              assert.equal(name, 'bar')
              assert.equal(path, 'foo.bar')
              return {
                state: {
                  foo: 'bar'
                }
              }
            }
          }
        }
      }
    })
    assert.deepEqual(controller.getState(), {foo: {bar: {foo: 'bar'}}})
  })
  it('should expose method to get signals', () => {
    const controller = new Controller({
      signals: {
        foo: []
      },
      modules: {
        moduleA: {
          signals: {
            foo: []
          }
        }
      }
    })
    assert.ok(controller.getSignal('foo'))
    assert.ok(controller.getSignal('moduleA.foo'))
  })
  it('should expose method to get model', () => {
    const controller = new Controller({
      signals: {
        foo: []
      },
      modules: {
        moduleA: {
          signals: {
            foo: []
          }
        }
      }
    })
    assert.equal(controller.getModel(), controller.model)
  })
  it('should create JSON stringify friendly value of unserializable payload property to signal', () => {
    const controller = new Controller({
      devtools: {init () {}},
      signals: {
        foo: [({props}) => assert.equal(JSON.stringify(props), '{"date":"[Date]"}')]
      }
    })
    controller.getSignal('foo')({
      date: new Date()
    })
  })
  it('should ignore when passing in unserializable payload to signal', () => {
    const controller = new Controller({
      devtools: {init () {}},
      signals: {
        foo: [
          ({props}) => assert.deepEqual(props, {})
        ]
      }
    })
    controller.getSignal('foo')(new Date())
  })
  it('should throw when pointing to a non existing signal', () => {
    const controller = new Controller({})
    assert.throws(() => {
      controller.getSignal('foo.bar')()
    })
  })
  it('should return undefined when grabbing non existing state', () => {
    const controller = new Controller({})
    assert.equal(controller.getState('foo.bar'), undefined)
  })
  it('should flush at async action, resolved parallel and end of signal', (done) => {
    let flushCount = 0
    const controller = new Controller({
      signals: {
        test: [
          () => Promise.resolve(),
          [
            () => Promise.resolve(),
            () => Promise.resolve()
          ]
        ]
      }
    })
    const originFlush = controller.flush
    controller.flush = function (...args) {
      flushCount++
      originFlush.apply(this, args)
    }
    controller.once('end', () => {
      assert.equal(flushCount, 4)
      done()
    })
    controller.getSignal('test')()
  })
  it('should flush model after module initialization', () => {
    const controller = new Controller({
      modules: {
        editor: {
          state: {
            this: 'that'
          }
        }
      }
    })
    assert.deepEqual(controller.model.changedPaths, [])
  })
  it('should flush async mutations', (done) => {
    const controller = new Controller({
      signals: {
        test: [
          ({state}) => setTimeout(() => state.set('foo', 'bar'))
        ]
      }
    })
    controller.on('flush', (changes) => {
      assert.deepEqual(changes, [{
        path: ['foo'],
        forceChildPathUpdates: true
      }])
      done()
    })
    controller.getSignal('test')()
  })
  it('should flush optimally in complex signals', (done) => {
    let flushCount = 0
    const controller = new Controller({
      signals: {
        test: [
          () => {},
          () => Promise.resolve(),
          () => {},
          [
            ({path}) => Promise.resolve(path.a()), {
              a: [
                () => {}
              ]
            },
            () => Promise.resolve()
          ]
        ]
      }
    })
    const originFlush = controller.flush
    controller.flush = function (...args) {
      flushCount++
      originFlush.apply(this, args)
    }
    controller.once('end', () => {
      assert.equal(flushCount, 4)
      done()
    })
    controller.getSignal('test')()
  })
  it('should remove default error listener when overriden', (done) => {
    const controller = new Controller({
      signals: {
        test: [() => { foo.bar = 'baz' }] // eslint-disable-line
      }
    })
    controller.on('error', () => {
      assert(true)
      done()
    })
    controller.getSignal('test')()
  })
  it('should remove default error listener when overriden using devtools', (done) => {
    const controller = new Controller({
      devtools: {init (ctrl) { ctrl.on('error', () => {}) }},
      signals: {
        test: [() => { foo.bar = 'baz' }] // eslint-disable-line
      }
    })
    controller.on('error', () => {
      assert(true)
      done()
    })
    controller.getSignal('test')()
  })
  it('should expose method to removeModule using path', () => {
    const controller = new Controller({
      modules: {
        foo: {
          modules: {},
          signals: {},
          state: {
            bar: 'baz'
          }
        }
      }
    })
    assert.ok(controller.module.modules['foo'])
    controller.removeModule('foo')
    assert.equal(controller.getState('foo'), undefined)
  })
  it('should expose method to addModule using path', () => {
    const controller = new Controller({
      state: {
        test: true
      }
    })
    const module = {
      modules: {},
      signals: {},
      state: {bar: 'baz'}
    }
    controller.addModule('foo', module)
    assert.ok(controller.module.modules['foo'])
    assert.deepEqual(controller.module.modules, {foo: {
      modules: {},
      signals: {},
      state: {
        bar: 'baz'
      }}})
    assert.equal(controller.getState('foo.bar'), 'baz')
  })
  it('should add signals correctly when module added', () => {
    const controller = new Controller({
      modules: {}
    })
    const module = {
      signals: {
        bar: []
      }
    }
    controller.addModule('foo', module)
    assert.ok(controller.getSignal('foo.bar'))
  })
  it('should add correct state when adding module', () => {
    const controller = new Controller({
      state: {}
    })
    const module = {
      modules: {},
      signals: {},
      state: {bar: 'baz'}
    }
    controller.addModule('foo', module)
    assert.deepEqual(controller.getState('foo.bar'), 'baz')
  })
  it('should add provider to contextProviders when adding module', () => {
    const controller = new Controller({
      state: {}
    })
    const module = {
      state: {bar: 'baz'},
      provider () {}
    }
    const before = controller.contextProviders.length
    controller.addModule('foo', module)
    const after = controller.contextProviders.length
    assert.equal(after, before + 1)
  })
  it('should remove provider from contextProviders when removing module', () => {
    const controller = new Controller({
      state: {},
      modules: {
        foo: {
          state: {bar: 'baz'},
          provider () {}
        }
      }
    })
    const before = controller.contextProviders.length
    controller.removeModule('foo')
    const after = controller.contextProviders.length
    assert.equal(after, before - 1)
  })
})
