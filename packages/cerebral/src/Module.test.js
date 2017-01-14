/* eslint-env mocha */
import Controller from './Controller'
import assert from 'assert'

describe('Module', () => {
  it('should instantiate with initial state', () => {
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
  it('should instantiate with signals', () => {
    const controller = new Controller({
      modules: {
        foo: {
          signals: {
            bar: []
          }
        }
      }
    })

    assert.ok(controller.getSignal('foo.bar'))
  })
  it('should run signals with providers', () => {
    const controller = new Controller({
      modules: {
        foo: {
          signals: {
            signalA: [(context) => {
              assert.equal(context.foo, 'foo')
              assert.equal(context.bar, 'bar')
            }]
          },
          provider (context) {
            context.foo = 'foo'

            return context
          }
        },
        bar: {
          signals: {
            signalB: [(context) => {
              assert.equal(context.bar, 'bar')
              assert.equal(context.foo, 'foo')
            }]
          },
          provider (context) {
            context.bar = 'bar'

            return context
          }
        }
      }
    })

    controller.getSignal('foo.signalA')()
    controller.getSignal('bar.signalB')()
  })
  it('should keep module instance', () => {
    class Foo {
      constructor () {
        this.state = {foo: 'bar'}
        this.signals = {bar: [(context) => { assert.equal(context.foo, 'foo') }]}
        this.provider = (context) => {
          context.foo = 'foo'

          return context
        }
      }

      getBar () {
        return 'bar'
      }
    }

    const controller = new Controller({
      modules: {
        foo: new Foo()
      }
    })

    assert.deepEqual(controller.getState(), {foo: {foo: 'bar'}})
    controller.getSignal('foo.bar')()
    assert.equal(controller.module.modules.foo.getBar(), 'bar')
  })
})
