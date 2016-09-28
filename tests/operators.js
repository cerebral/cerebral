import Controller from '../src/Controller'
import assert from 'assert'

describe('Operators', () => {
  describe('wait', () => {
    it('should hold execution for set time', (done) => {
      const wait = require('../src/operators/wait').default
      const start = Date.now()
      const controller = new Controller({
        signals: {
          test: [
            wait(100),
            () => {
              assert.ok(Date.now() - start >= 100)
              done()
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
  })
  describe('set', () => {
    it('should set value to model', () => {
      const set = require('../src/operators/set').default
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set('state:foo', 'bar2')
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
    it('should set non string value to model', () => {
      const set = require('../src/operators/set').default
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set('state:foo', {bar: 'baz'})
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: {bar: 'baz'}})
    })
    it('should set value to model from input', () => {
      const set = require('../src/operators/set').default
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set('state:foo', 'input:value')
          ]
        }
      })
      controller.getSignal('test')({
        value: 'bar2'
      })
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
  })
})
