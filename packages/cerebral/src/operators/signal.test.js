/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, set, signal} from './'

describe('operator.signal', () => {
  it('should return signal from path', () => {
    const factory = (signalTemplate) => {
      function action (context) {
        assert.equal(typeof signalTemplate(context).value, 'function')
      }

      return action
    }
    const controller = new Controller({
      signals: {
        bar: [],
        test: [
          factory(signal`bar`)
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should allow input in template literal', () => {
    const factory = (signalTemplate) => {
      function action (context) {
        assert.equal(typeof signalTemplate(context).value, 'function')
      }

      return action
    }
    const controller = new Controller({
      signals: {
        test: [
          factory(signal`${input`module`}.bar`)
        ]
      },
      modules: {
        foo: {
          signals: {
            bar: []
          }
        }
      }
    })
    controller.getSignal('test')({module: 'foo'})
  })
})
