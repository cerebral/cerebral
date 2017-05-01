/* eslint-env mocha */
import Controller from './Controller'
import provide from './Provide'
import assert from 'assert'

describe('Provide', () => {
  it('should create a provider', (done) => {
    const controller = new Controller({
      providers: [
        provide('test', {foo: 'bar'})
      ],
      signals: {
        test: [
          ({test}) => {
            assert.deepEqual(test, {foo: 'bar'})
            done()
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
})
