/* eslint-env mocha */
import Controller from '../src/Controller'
import assert from 'assert'

describe('Operators', () => {
  describe('debounce', () => {
    it('should debounce execution', (done) => {
      const debounce = require('../src/operators/debounce').default
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
  describe('filter', () => {
    it('should filter input', () => {
      const filter = require('../src/operators/filter').default
      let accepted = 0
      let discarded = 0
      const controller = new Controller({
        signals: {
          test: [
            filter('input:value', (value) => Boolean(value.length)), {
              accepted: [
                () => { accepted++ }
              ],
              discarded: [
                () => { discarded++ }
              ]
            }
          ]
        }
      })
      controller.getSignal('test')({value: ''})
      controller.getSignal('test')({value: 'foo'})
      assert.equal(accepted, 1)
      assert.equal(discarded, 1)
    })
    it('should filter state', () => {
      const filter = require('../src/operators/filter').default
      let discarded = 0
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            filter('state:foo', (value) => value === 'bar'), {
              accepted: [
                ({state}) => { state.set('foo', 'bar2') }
              ],
              discarded: [
                () => { discarded++ }
              ]
            }
          ]
        }
      })
      controller.getSignal('test')()
      controller.getSignal('test')()
      assert.equal(discarded, 1)
    })
  })
  describe('toggle', () => {
    it('should toggle state', () => {
      const toggle = require('../src/operators/toggle').default
      const controller = new Controller({
        state: {
          foo: true
        },
        signals: {
          test: [
            toggle('state:foo')
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: false})
    })
  })
  describe('when', () => {
    it('should check truthy value of input', () => {
      const when = require('../src/operators/when').default
      let count = 0
      const controller = new Controller({
        signals: {
          test: [
            when('input:foo'), {
              true: [() => { count++ }],
              false: []
            }
          ]
        }
      })
      controller.getSignal('test')({foo: 'bar'})
      assert.equal(count, 1)
    })
    it('should check truthy value of state', () => {
      const when = require('../src/operators/when').default
      let count = 0
      const controller = new Controller({
        state: {
          foo: false
        },
        signals: {
          test: [
            when('state:foo'), {
              true: [],
              false: [() => { count++ }]
            }
          ]
        }
      })
      controller.getSignal('test')()
      assert.equal(count, 1)
    })
  })
  describe('wait', () => {
    it('should hold execution for set time', (done) => {
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
  describe('set', () => {
    it('should set value to model', () => {
      const set = require('../src/operators/set').default
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set('state:foo', 'bar2')
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
    it('should set non string value to model', () => {
      const set = require('../src/operators/set').default
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set('state:foo', {bar: 'baz'})
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: {bar: 'baz'}})
    })
    it('should set value to model from input', () => {
      const set = require('../src/operators/set').default
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set('state:foo', 'input:value')
          ]
        }
      })
      controller.getSignal('test')({
        value: 'bar2'
      })
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
    it('should set value to model from model', () => {
      const set = require('../src/operators/set').default
      const controller = new Controller({
        state: {
          foo: 'bar',
          grabValue: 'bar2'
        },
        signals: {
          test: [
            set('state:foo', 'state:grabValue')
          ]
        }
      })
      controller.getSignal('test')()
      assert.equal(controller.getState().foo, 'bar2')
    })
  })
})
