/* eslint-env mocha */
import Path from './Path'
import assert from 'assert'

describe('primitives', () => {
  it('should initiate correctly', () => {
    const payload = {
      foo: 'bar'
    }
    const path = new Path('path', payload)

    assert.ok(path instanceof Path)
    assert.equal(path.path, 'path')
    assert.deepEqual(path.payload, payload)
    assert.equal(path.toJSON().path, 'path')
    assert.deepEqual(path.toJSON().payload, payload)
  })
})
