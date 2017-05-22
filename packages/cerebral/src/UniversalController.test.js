/* eslint-env mocha */
import UniversalController from './UniversalController'
import assert from 'assert'

describe('UniversalController', () => {
  it('should track state changes', () => {
    const controller = new UniversalController({
      state: {
        foo: 'bar'
      }
    })
    controller.run([
      function stateUpdate ({state}) {
        state.set('foo', 'bar2')
      }
    ])
    assert.deepEqual(controller.getState(), {foo: 'bar2'})
    assert.deepEqual(controller.changes, [{path: ['foo'], forceChildPathUpdates: true}])
  })
  it('should expose method to produce script with state changes', () => {
    const controller = new UniversalController({
      state: {
        foo: 'bar'
      }
    })
    controller.run([
      function stateUpdate ({state}) {
        state.set('foo', 'bar2')
      }
    ])
    assert.equal(controller.getScript(), '<script>window.CEREBRAL_STATE = {"foo":"bar2"}</script>')
  })
  it('should throw error when using run twice', () => {
    const controller = new UniversalController({
      state: {
        foo: 'bar'
      }
    })
    controller.run([
      function stateUpdate ({state}) {
        state.set('foo', state.get('foo') + '!')
      }
    ])
    assert.throws(() => {
      controller.run([
        function stateUpdate ({state}) {
          state.set('foo', state.get('foo') + '!')
        }
      ])
    })
  })
})
