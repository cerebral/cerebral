/* eslint-env mocha */
import Service from './Service'
import assert from 'assert'

describe('ServiceModule', () => {
  it('should instantiate with signals', () => {
    const service = new Service({
      modules: {
        foo: {
          signals: {
            bar: []
          }
        }
      }
    })

    assert.ok(service.getSignal('foo.bar'))
  })
  it('should run signals with providers', () => {
    const service = new Service({
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

    service.getSignal('foo.signalA')()
    service.getSignal('bar.signalB')()
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

    const service = new Service({
      modules: {
        foo: new Foo()
      }
    })

    service.getSignal('foo.bar')()
    assert.equal(service.module.modules.foo.getBar(), 'bar')
  })
})
