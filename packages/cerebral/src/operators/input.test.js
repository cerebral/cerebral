/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, string} from './'

describe('operator.input', () => {
  it('should read value from input', () => {
    const controller = new Controller({
      signals: {
        test: [
          (context) => {
            assert.deepEqual(string`foo.${input`foo`}`(context).value, 'foo.bar')
          }
        ]
      }
    })
    controller.getSignal('test')({foo: 'bar'})
  })
})
