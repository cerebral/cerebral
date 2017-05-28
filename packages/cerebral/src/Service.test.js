/* eslint-env mocha */
import Service from './Service'
import assert from 'assert'

describe('Service', () => {
  it('should instantiate with signals defined', () => {
    const service = new Service({
      signals: {
        foo: []
      }
    })
    assert.ok(service.getSignal('foo'))
  })
  it('should instantiate providers defined', () => {
    const service = new Service({
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
    service.getSignal('foo')()
  })
  it('should instantiate modules defined as objects', () => {
    const service = new Service({
      modules: {
        foo: {
          signals: {
            bar: []
          }
        }
      }
    })
    assert.deepEqual(service.getSignal('foo.bar'), [])
  })
  it('should instantiate modules defined as functions', () => {
    const service = new Service({
      modules: {
        foo: () => ({
          signals: {
            bar: []
          }
        })
      }
    })
    assert.deepEqual(service.getSignal('foo.bar'), [])
  })
  it('should pass instance of service and path info on functions module instantiation', () => {
    const service = new Service({
      modules: {
        foo: {
          modules: {
            bar: ({service, path, name}) => {
              assert.ok(service)
              assert.equal(name, 'bar')
              assert.equal(path, 'foo.bar')
              return {
                signals: {
                  foo: []
                }
              }
            }
          }
        }
      }
    })
    assert.deepEqual(service.getSignal('foo.bar.foo'), [])
  })
  it('should expose method to get signals', () => {
    const service = new Service({
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
    assert.ok(service.getSignal('foo'))
    assert.ok(service.getSignal('moduleA.foo'))
  })
  it('should create JSON stringify friendly value of unserializable payload property to signal', () => {
    const service = new Service({
      devtools: {init () {}},
      signals: {
        foo: [({props}) => assert.equal(JSON.stringify(props), '{"date":"[Date]"}')]
      }
    })
    service.getSignal('foo')({
      date: new Date()
    })
  })
  it('should ignore when passing in unserializable payload to signal', () => {
    const service = new Service({
      devtools: {init () {}},
      signals: {
        foo: [
          ({props}) => assert.deepEqual(props, {})
        ]
      }
    })
    service.getSignal('foo')(new Date())
  })
  it('should throw when pointing to a non existing signal', () => {
    const service = new Service({})
    assert.throws(() => {
      service.getSignal('foo.bar')()
    })
  })
  it('should remove default error listener when overriden', (done) => {
    const service = new Service({
      signals: {
        test: [() => { foo.bar = 'baz' }] // eslint-disable-line
      }
    })
    service.on('error', () => {
      assert(true)
      done()
    })
    service.getSignal('test')()
  })
  it('should remove default error listener when overriden using devtools', (done) => {
    const service = new Service({
      devtools: {init (ctrl) { ctrl.on('error', () => {}) }},
      signals: {
        test: [() => { foo.bar = 'baz' }] // eslint-disable-line
      }
    })
    service.on('error', () => {
      assert(true)
      done()
    })
    service.getSignal('test')()
  })
})
