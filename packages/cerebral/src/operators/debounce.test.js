/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {debounce} from './'

describe('operator.debounce', () => {
  it('should debounce execution', (done) => {
    let discardedCount = 0
    const controller = new Controller({
      signals: {
        test: [
          debounce(50, [
            () => {
              assert.equal(discardedCount, 1)
              done()
            }
          ]),
          () => { discardedCount++ }
        ]
      }
    })
    controller.getSignal('test')()
    setTimeout(() => {
      controller.getSignal('test')()
    }, 10)
  })
})
