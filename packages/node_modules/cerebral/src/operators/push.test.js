/* eslint-env mocha */
import {Controller} from '../'
import assert from 'assert'
import {push} from './'
import {props, state} from '../tags'

describe('operator.push', () => {
  it('should push value in model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b']
      },
      signals: {
        test: [
          push(state`list`, 'c')
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['a', 'b', 'c']})
  })
  it('should push value from props in model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b']
      },
      signals: {
        test: [
          push(state`list`, props`value`)
        ]
      }
    })
    controller.getSignal('test')({value: 'c'})
    assert.deepEqual(controller.getState(), {list: ['a', 'b', 'c']})
  })
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          push(props`list`, 'bar')
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
