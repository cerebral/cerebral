/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {unset} from './'
import {input, state} from '../tags'

describe('operator.unset', () => {
  it('should unset value in model', () => {
    const controller = Controller({
      state: {
        foo: 'bar',
        bar: 'baz'
      },
      signals: {
        test: [
          unset(state`foo`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {bar: 'baz'})
  })
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          unset(input`foo`)
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
