/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, set, signal} from './'

describe('operator.signal', () => {
  it('should return signal from path', (done) => {
    const barSignal = [
      (context) => {
        assert.ok(true)
        done()
      }
    ]
    const controller = new Controller({
      signals: {
        bar: barSignal,
        test: [
          set(input`progress`, signal`bar`),
          ({input: {progress}}) => {
            setTimeout(progress)
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should allow input in template literal', (done) => {
    const barSignal = [
      (context) => {
        assert.ok(true)
        done()
      }
    ]
    const controller = new Controller({
      signals: {
        refbar: barSignal,
        test: [
          set(input`progress`, signal`ref${input`ref`}`),
          ({input: {progress}}) => {
            setTimeout(progress)
          }
        ]
      }
    })
    controller.getSignal('test')({ref: 'bar'})
  })
})
