/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {concat} from './'
import {input, state} from '../tags'

describe('operator.concat', () => {
  it('should concat literal array in model', () => {
    const controller = Controller({
      state: {
        list: ['one']
      },
      signals: {
        test: [
          concat(state`list`, ['two'])
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['one', 'two']})
  })
  it('should concat state array in model', () => {
    const controller = Controller({
      state: {
        list: ['one'],
        list2: ['two', 'three']
      },
      signals: {
        test: [
          concat(state`list`, state`list2`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['one', 'two', 'three'], list2: ['two', 'three']})
  })
  it('should throw on bad argument', () => {
    const controller = Controller({
      state: {
        list: ['one']
      },
      signals: {
        test: [
          concat(input`list`, ['two'])
        ]
      }
    })

    assert.throws(() => {
      controller.getSignal('test')()
    }, /operator.concat/)
  })
})
