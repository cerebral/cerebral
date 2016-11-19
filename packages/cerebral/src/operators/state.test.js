/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {state, toString} from './'

describe('operator.state', () => {
  it('should build path', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          (context) => {
            assert.deepEqual(toString`foo.${state`foo`}`(context).value, 'foo.bar')
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
})
