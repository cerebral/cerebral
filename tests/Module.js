import Controller from '../src/Controller'
import Module from '../src/Module'
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

    assert.ok(controller.getSignals('foo.bar'))
  })
  it('should run signals with providers', () => {
    const controller = new Controller({
      modules: {
        foo: {
          signals: {
            signalA: [(context) => {
              assert.equal(context.foo, 'foo')
              assert.ok(!context.bar)
            }]
          },
          providers: [
            (context) => {
              context.foo = 'foo'

              return context
            }
          ]
        },
        bar: {
          signals: {
            signalB: [(context) => {
              assert.equal(context.bar, 'bar')
              assert.ok(!context.foo)
            }]
          },
          providers: [
            (context) => {
              context.bar = 'bar'

              return context
            }
          ]
        }
      }
    })

    controller.getSignals('foo.signalA')()
    controller.getSignals('bar.signalB')()
  })
})
