/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {filter, input, state} from './'

describe('operator.filter', () => {
  it('should filter input', () => {
    let accepted = 0
    let discarded = 0
    const controller = new Controller({
      signals: {
        test: [
          filter(input`value`, (value) => Boolean(value.length)), {
            accepted: [
              () => { accepted++ }
            ],
            discarded: [
              () => { discarded++ }
            ]
          }
        ]
      }
    })
    controller.getSignal('test')({value: ''})
    controller.getSignal('test')({value: 'foo'})
    assert.equal(accepted, 1)
    assert.equal(discarded, 1)
  })
  it('should filter state', () => {
    let discarded = 0
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          filter(state`foo`, (value) => value === 'bar'), {
            accepted: [
              ({state}) => { state.set('foo', 'bar2') }
            ],
            discarded: [
              () => { discarded++ }
            ]
          }
        ]
      }
    })
    controller.getSignal('test')()
    controller.getSignal('test')()
    assert.equal(discarded, 1)
  })
})
