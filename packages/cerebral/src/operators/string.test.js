/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, string} from './'

describe('operator.string', () => {
  it('should build path', () => {
    const controller = new Controller({
      signals: {
        test: [
          (context) => {
            assert.deepEqual(string`foo.${input`ref`}`(context).toValue(), 'foo.bar')
          }
        ]
      }
    })
    controller.getSignal('test')({ref: 'bar'})
  })
})
