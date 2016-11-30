/* eslint-env mocha */
import Controller from './Controller'
import Module from './Module'
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
  it('should pass instance of module on functions module instantiation', () => {
    const controller = new Controller({
      modules: {
        foo: (module) => {
          assert.ok(module instanceof Module)
          return {
            state: {
              foo: 'bar'
            }
          }
        }
      }
    })
    assert.deepEqual(controller.getState(), {foo: {foo: 'bar'}})
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
        foo: [({input}) => assert.equal(JSON.stringify(input), '{"date":"[Date]"}')]
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
          ({input}) => assert.deepEqual(input, {})
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
  it('should flush at async action, path end and end of signal', (done) => {
    let flushCount = 0
    const controller = new Controller({
      signals: {
        test: [
          () => {},
          () => Promise.resolve(),
          ({path}) => path.foo(), {
            foo: [() => {}]
          }
        ]
      }
    })
    controller.on('flush', () => flushCount++)
    controller.runTree.once('end', () => {
      assert.equal(flushCount, 3)
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
    assert.deepEqual(controller.model.flush(), {})
  })
})
