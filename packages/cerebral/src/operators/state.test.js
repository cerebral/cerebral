/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, state} from './'

describe('operator.state', () => {
  it('should build path', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          () => {
            assert.deepEqual(state`foo.${input`ref`}`({input: {ref: 'bar'}}).path, 'foo.bar')
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
})
