/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {wait} from './'

describe('operator.wait', () => {
  it('should hold execution for set time', (done) => {
    const start = Date.now()
    const controller = Controller({
      signals: {
        test: [
          wait(100),
          () => {
            assert.ok(Date.now() - start >= 100)
            done()
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should hold execution for set time in parallel', (done) => {
    const start = Date.now()
    const controller = Controller({
      signals: {
        test: [
          [
            wait(100), {
              continue: [
                () => {
                  assert.ok(Date.now() - start >= 100)
                  done()
                }
              ]
            }
          ]
        ]
      }
    })
    controller.getSignal('test')()
  })
})
