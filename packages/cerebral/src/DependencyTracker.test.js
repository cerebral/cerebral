/* eslint-env mocha */
import DependencyTracker from './DependencyTracker'
import {compute} from './'
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
    const computed = compute(({state, props}) => {
      return state('foo') + props('bar')
    })
    const tracker = new DependencyTracker(computed)
    tracker.run(() => 'bar', () => 'foo')
    assert.equal(tracker.value, 'barfoo')
    assert.deepEqual(tracker.stateTrackMap, {foo: true})
    assert.deepEqual(tracker.propsTrackMap, {bar: true})
  })
  it('should pass props getter when run', () => {
    const computed = compute(({props}) => {
      return props()
    })
    const tracker = new DependencyTracker(computed)
    tracker.run(() => {}, () => 'bar')
    assert.equal(tracker.value, 'bar')
  })
  it('should be able to match changes map', () => {
    const tracker = new DependencyTracker()
    tracker.stateTrackMap = {
      'foo.bar': true
    }
    assert.equal(tracker.match({
      foo: {
        bar: true
      }
    }, {}), true)
  })
})
