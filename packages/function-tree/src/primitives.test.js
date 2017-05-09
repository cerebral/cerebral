/* eslint-env mocha */
import {Primitive, Sequence, Parallel} from './primitives'
import assert from 'assert'

describe('primitives', () => {
  it('should correctly initiate primitive', () => {
    const items = [
      function a () {}
    ]
    const primitive = new Primitive('primitive', 'test', items)

    assert.ok(primitive instanceof Primitive)
    assert.equal(primitive.type, 'primitive')
    assert.equal(primitive.name, 'test')
    assert.deepEqual(primitive.items, items)
    assert.equal(primitive.toJSON().name, 'test')
    assert.equal(primitive.toJSON()._functionTreePrimitive, true)
    assert.equal(primitive.toJSON().type, 'primitive')
    assert.deepEqual(primitive.toJSON().items, items)
  })
  it('should throw when items is not array', () => {
    const items = function a () {}
    assert.throws(() => {
      new Primitive('primitive', items) // eslint-disable-line no-new
    }, (err) => {
      if ((err instanceof Error) && err.name === 'FunctionTreeError' && err.toJSON) {
        return err.toJSON().message === 'You have not passed an array of functions to primitive'
      }
    })
  })
  describe('sequence', () => {
    it('should have extended Primitive', () => {
      const items = [
        function a () {}
      ]
      const sequence = new Sequence(items)

      assert.ok(sequence instanceof Primitive)
      assert.equal(sequence.type, 'sequence')
      assert.equal(sequence.name, null)
      assert.deepEqual(sequence.items, items)
      assert.equal(sequence.toJSON().name, null)
      assert.equal(sequence.toJSON()._functionTreePrimitive, true)
      assert.equal(sequence.toJSON().type, 'sequence')
      assert.deepEqual(sequence.toJSON().items, items)
    })
    it('should set name of sequence', () => {
      const items = [
        function a () {}
      ]
      const sequence = new Sequence('test', items)

      assert.ok(sequence instanceof Primitive)
      assert.equal(sequence.type, 'sequence')
      assert.equal(sequence.name, 'test')
      assert.deepEqual(sequence.items, items)
      assert.equal(sequence.toJSON().name, 'test')
      assert.equal(sequence.toJSON()._functionTreePrimitive, true)
      assert.equal(sequence.toJSON().type, 'sequence')
      assert.deepEqual(sequence.toJSON().items, items)
    })
  })
  describe('parallel', () => {
    it('should have extended Primitive', () => {
      const items = [
        function a () {}
      ]
      const parallel = new Parallel(items)

      assert.ok(parallel instanceof Primitive)
      assert.equal(parallel.type, 'parallel')
      assert.equal(parallel.name, null)
      assert.deepEqual(parallel.items, items)
      assert.equal(parallel.toJSON().name, null)
      assert.equal(parallel.toJSON()._functionTreePrimitive, true)
      assert.equal(parallel.toJSON().type, 'parallel')
      assert.deepEqual(parallel.toJSON().items, items)
    })
    it('should set name of parallel', () => {
      const items = [
        function a () {}
      ]
      const parallel = new Parallel('test', items)

      assert.ok(parallel instanceof Primitive)
      assert.equal(parallel.type, 'parallel')
      assert.equal(parallel.name, 'test')
      assert.deepEqual(parallel.items, items)
      assert.equal(parallel.toJSON().name, 'test')
      assert.equal(parallel.toJSON()._functionTreePrimitive, true)
      assert.equal(parallel.toJSON().type, 'parallel')
      assert.deepEqual(parallel.toJSON().items, items)
    })
  })
})
