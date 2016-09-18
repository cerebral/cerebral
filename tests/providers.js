import Controller from '../src/Controller'
import Module from '../src/Module'
import assert from 'assert'

describe('providers', () => {
  describe('VerifyInput', () => {
    it('should throw when invalid input', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        }
      })
      assert.throws(() => {
        const obj = {}
        obj.circular = obj
        controller.getSignals('foo')(obj)
      })
    })
  })
  describe('Model', () => {
    it('should be able to GET state', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          foo: [({model}) => assert.deepEqual(model.get(), {foo: 'bar'})]
        }
      })
      controller.getSignals('foo')()
    })
    it('should be able to SET state', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          foo: [({model}) => model.set('foo', 'bar2')]
        }
      })
      controller.getSignals('foo')()
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
    it('should be able to PUSH state', () => {
      const controller = new Controller({
        state: {
          foo: ['foo']
        },
        signals: {
          foo: [({model}) => model.push('foo', 'bar')]
        }
      })
      controller.getSignals('foo')()
      assert.deepEqual(controller.getState(), {foo: ['foo', 'bar']})
    })
    it('should be able to PUSH state', () => {
      const controller = new Controller({
        state: {
          foo: ['foo']
        },
        signals: {
          foo: [({model}) => model.push('foo', 'bar')]
        }
      })
      controller.getSignals('foo')()
      assert.deepEqual(controller.getState(), {foo: ['foo', 'bar']})
    })
  })
})
