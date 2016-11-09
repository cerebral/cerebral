/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {Computed} from '../'
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
  it('should allow computed in template literal', () => {
    const computed = Computed({
      foo: 'foo'
    }, (props) => props.foo)
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          (context) => {
            assert.deepEqual(string`foo.${computed}`(context).toValue(), 'foo.bar')
          }
        ]
      }
    })
    controller.getSignal('test')({ref: 'bar'})
  })
})
