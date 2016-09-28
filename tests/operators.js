import Controller from '../src/Controller'
import assert from 'assert'

describe('Operators', () => {
  it('wait', (done) => {
    const wait = require('../src/operators/wait').default
    const start = Date.now()
    const controller = new Controller({
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
})
