/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {debounce} from './'
import {parallel} from '../'

describe('operator.debounce', () => {
  it('should debounce execution', (done) => {
    const result = []
    const controller = Controller({
      signals: {
        test: [
          debounce(50), {
            continue: [() => {
              assert.deepEqual(result, ['discard'])
              done()
            }],
            discard: [
              () => { result.push('discard') }
            ]
          }
        ]
      }
    })
    controller.getSignal('test')()
    setTimeout(() => {
      controller.getSignal('test')()
    }, 10)
  })
  it('should debounce execution in parallel', (done) => {
    const result = []
    const controller = Controller({
      signals: {
        test: [
          parallel([
            debounce(50), {
              continue: [
                () => {
                  assert.deepEqual(result, ['parallel', 'parallel', 'discard'])
                  done()
                }
              ],
              discard: [() => { result.push('discard') }]
            },
            () => { result.push('parallel') }
          ])
        ]
      }
    })
    controller.getSignal('test')()
    setTimeout(() => {
      controller.getSignal('test')()
    }, 10)
  })
})
