/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, state, when} from './'

describe('operator.when', () => {
  it('should check truthy value of input', () => {
    let count = 0
    const controller = new Controller({
      signals: {
        test: [
          when(input`foo`), {
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
    let count = 0
    const controller = new Controller({
      state: {
        foo: false
      },
      signals: {
        test: [
          when(state`foo`), {
            true: [],
            false: [() => { count++ }]
          }
        ]
      }
    })
    controller.getSignal('test')()
    assert.equal(count, 1)
  })
  it('should check truthy input using function', () => {
    let accepted = 0
    let discarded = 0
    const controller = new Controller({
      signals: {
        test: [
          when(input`value`, (value) => Boolean(value.length)), {
            true: [
              () => { accepted++ }
            ],
            false: [
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
  it('should check truthy state using function', () => {
    let discarded = 0
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          when(state`foo`, (value) => value === 'bar'), {
            true: [
              ({state}) => { state.set('foo', 'bar2') }
            ],
            false: [
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
  it('should check truthy state using function and multiple values', () => {
    const results = []
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          when(state`foo`, input`bar`, (foo, bar) => foo === bar), {
            true: [
              () => { results.push('true') }
            ],
            false: [
              () => { results.push('false') }
            ]
          }
        ]
      }
    })
    controller.getSignal('test')({bar: 'bar'})
    controller.getSignal('test')({bar: 'nope'})
    assert.deepEqual(results, ['true', 'false'])
  })
  it('should check truthy state using function and literal values', () => {
    const results = []
    const controller = new Controller({
      signals: {
        test: [
          when(input`foo`, 'bar', (foo, bar) => foo === bar), {
            true: [
              () => { results.push('true') }
            ],
            false: [
              () => { results.push('false') }
            ]
          }
        ]
      }
    })
    controller.getSignal('test')({foo: 'bar'})
    controller.getSignal('test')({foo: 'nope'})
    assert.deepEqual(results, ['true', 'false'])
  })
})
