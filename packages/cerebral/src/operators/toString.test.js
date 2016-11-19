/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {Computed} from '../'
import {input, toString} from './'

describe('operator.string', () => {
  it('should build path', () => {
    const controller = new Controller({
      signals: {
        test: [
          (context) => {
            assert.deepEqual(toString`foo.${input`ref`}`(context).value, 'foo.bar')
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
            assert.deepEqual(toString`foo.${computed}`(context).value, 'foo.bar')
          }
        ]
      }
    })
    controller.getSignal('test')({ref: 'bar'})
  })
})
