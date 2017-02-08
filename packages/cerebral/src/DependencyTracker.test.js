/* eslint-env mocha */
import DependencyTracker from './DependencyTracker'
import {compute} from './'
import {state, props} from './tags'
import assert from 'assert'

describe('DependencyTracker', () => {
  it('should set value when run', () => {
    const computed = compute(() => {
      return 'foo'
    })
    const tracker = new DependencyTracker(computed)
    tracker.run()
    assert.equal(tracker.value, 'foo')
  })
  it('should track paths when run', () => {
    const computed = compute((get) => {
      return get(state`foo`) + get(props`bar`)
    })
    const tracker = new DependencyTracker(computed)
    tracker.run(() => 'bar', {bar: 'foo'})
    assert.equal(tracker.value, 'barfoo')
    assert.deepEqual(tracker.stateTrackMap, {foo: {}})
    assert.deepEqual(tracker.propsTrackMap, {bar: {}})
  })
  it('should pass props getter when run', () => {
    const computed = compute((get) => {
      return get(props`foo`)
    })
    const tracker = new DependencyTracker(computed)
    tracker.run(() => {}, {foo: 'bar'})
    assert.equal(tracker.value, 'bar')
  })
  it('should be able to match changes map', () => {
    const tracker = new DependencyTracker()
    tracker.stateTrackMap = {
      foo: {
        children: {
          bar: {}
        }
      }
    }
    assert.equal(tracker.match([{
      path: ['foo', 'bar']
    }], {}), true)
  })
})
