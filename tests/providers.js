import Controller from '../src/Controller'
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
        controller.getSignal('foo')(obj)
      })
    })
  })
  describe('State', () => {
    it('should be able to GET state', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          foo: [({state}) => assert.deepEqual(state.get(), {foo: 'bar'})]
        }
      })
      controller.getSignal('foo')()
    })
    it('should be able to SET state', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          foo: [({state}) => state.set('foo', 'bar2')]
        }
      })
      controller.getSignal('foo')()
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
    it('should be able to PUSH state', () => {
      const controller = new Controller({
        state: {
          foo: ['foo']
        },
        signals: {
          foo: [({state}) => state.push('foo', 'bar')]
        }
      })
      controller.getSignal('foo')()
      assert.deepEqual(controller.getState(), {foo: ['foo', 'bar']})
    })
    it('should be able to PUSH state', () => {
      const controller = new Controller({
        state: {
          foo: ['foo']
        },
        signals: {
          foo: [({state}) => state.push('foo', 'bar')]
        }
      })
      controller.getSignal('foo')()
      assert.deepEqual(controller.getState(), {foo: ['foo', 'bar']})
    })
  })
})
