/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {equals} from './'
import {state, props} from '../tags'

describe('operator.equals', () => {
  it('should go down path based on props', () => {
    let count = 0
    const controller = Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          equals(props`foo`), {
            bar: [() => { count++ }],
            otherwise: []
          }
        ]
      }
    })
    controller.getSignal('test')({foo: 'bar'})
    assert.equal(count, 1)
  })
  it('should go down path based on state', () => {
    let count = 0
    const controller = Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          equals(state`foo`), {
            bar: [() => { count++ }],
            otherwise: []
          }
        ]
      }
    })
    controller.getSignal('test')()
    assert.equal(count, 1)
  })
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          equals('foo'), {
            bar: [() => {}],
            otherwise: []
          }
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
