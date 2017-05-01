/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {pop} from './'
import {props, state} from '../tags'

describe('operator.pop', () => {
  it('should pop value from model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b', 'c']
      },
      signals: {
        test: [
          pop(state`list`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['a', 'b']})
  })
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          pop(props`list`)
        ]
      }
    })

    controller.removeListener('error')
    controller.once('error', (error) => {
      assert.ok(error)
      done()
    })

    controller.getSignal('test')()
  })
})
