/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'

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
  it('should be able to SET state with an array in the path', () => {
    const controller = new Controller({
      state: {foo: ['bar']},
      signals: {
        foo: [({state}) => state.set('foo.0', 'baz')]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: ['baz']})
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
  it('should be able to MERGE state', () => {
    const controller = new Controller({
      state: {
        foo: {foo: 'bar'}
      },
      signals: {
        foo: [({state}) => state.merge('foo', {foo2: 'bar2'})]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: {foo: 'bar', foo2: 'bar2'}})
  })
  it('should be able to POP state', () => {
    const controller = new Controller({
      state: {
        foo: ['foo', 'bar']
      },
      signals: {
        foo: [({state}) => state.pop('foo')]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: ['foo']})
  })
  it('should be able to SHIFT state', () => {
    const controller = new Controller({
      state: {
        foo: ['foo', 'bar']
      },
      signals: {
        foo: [({state}) => state.shift('foo')]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: ['bar']})
  })
  it('should be able to UNSHIFT state', () => {
    const controller = new Controller({
      state: {
        foo: ['foo']
      },
      signals: {
        foo: [({state}) => state.unshift('foo', 'bar')]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: ['bar', 'foo']})
  })
  it('should be able to SPLICE state', () => {
    const controller = new Controller({
      state: {
        foo: ['foo']
      },
      signals: {
        foo: [({state}) => state.splice('foo', 0, 1, 'bar')]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: ['bar']})
  })
  it('should be able to UNSET state', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        foo: [({state}) => state.unset('foo')]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {})
  })
  it('should be able to CONCAT state', () => {
    const controller = new Controller({
      state: {
        foo: ['foo']
      },
      signals: {
        foo: [({state}) => state.concat('foo', ['bar'])]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: ['foo', 'bar']})
  })
  it('should provide a descriptive error when passing invalid value to state', () => {
    const controller = new Controller({
      devtools: {init () {}, sendExecutionData () {}},
      state: {
        foo: ''
      },
      signals: {
        foo: [({state}) => state.set('foo', () => {})]
      }
    })
    assert.throws(() => {
      controller.getSignal('foo')()
    }, Error)
  })
  it('should work with devtools', () => {
    const controller = new Controller({
      devtools: { init () {}, send () {}, sendExecutionData () {} },
      state: {
        foo: ['foo']
      },
      signals: {
        foo: [({state}) => state.splice('foo', 0, 1, 'bar')]
      }
    })
    controller.getSignal('foo')()
    assert.deepEqual(controller.getState(), {foo: ['bar']})
  })
})
