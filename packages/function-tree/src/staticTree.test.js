/* eslint-env mocha */
import staticTree from './staticTree'
import All from './All'
import assert from 'assert'

describe('StaticTree', () => {
  it('should create a static tree of an array', () => {
    const tree = staticTree([
      function test () {}
    ])

    assert.equal(tree.length, 1)
    assert.equal(tree[0].name, 'test')
    assert.equal(tree[0].functionIndex, 0)
    assert.equal(tree[0].isParallel, false)
    assert.ok(tree[0].function)
  })
  it('should create a static tree of a function', () => {
    const tree = staticTree(
      function test () {}
    )

    assert.equal(tree.length, 1)
    assert.equal(tree[0].name, 'test')
    assert.equal(tree[0].functionIndex, 0)
    assert.equal(tree[0].isParallel, false)
    assert.ok(tree[0].function)
  })
  it('should flatten arrays inside arrays', () => {
    const tree = staticTree([
      function a () {},
      [
        function b () {},
        function c () {}
      ],
      function d () {}
    ])

    assert.equal(tree.length, 4)
    assert.equal(tree[0].name, 'a')
    assert.equal(tree[0].functionIndex, 0)
    assert.equal(tree[0].isParallel, false)
    assert.ok(tree[0].function)
    assert.equal(tree[1].name, 'b')
    assert.equal(tree[1].functionIndex, 1)
    assert.equal(tree[1].isParallel, false)
    assert.ok(tree[1].function)
    assert.equal(tree[2].name, 'c')
    assert.equal(tree[2].functionIndex, 2)
    assert.equal(tree[2].isParallel, false)
    assert.ok(tree[2].function)
    assert.equal(tree[3].name, 'd')
    assert.equal(tree[3].functionIndex, 3)
    assert.equal(tree[3].isParallel, false)
    assert.ok(tree[3].function)
  })
  it('should handle paths', () => {
    const tree = staticTree([
      function a () {}, {
        foo: [
          function b () {}
        ]
      }
    ])

    assert.equal(tree.length, 1)
    assert.equal(tree[0].name, 'a')
    assert.equal(tree[0].functionIndex, 0)
    assert.equal(tree[0].isParallel, false)
    assert.ok(tree[0].function)
    assert.equal(tree[0].outputs.foo[0].name, 'b')
    assert.equal(tree[0].outputs.foo[0].functionIndex, 1)
    assert.equal(tree[0].outputs.foo[0].isParallel, false)
    assert.ok(tree[0].outputs.foo[0].function)
  })
  it('should identify parallel execution', () => {
    const tree = staticTree([
      new All([
        function a () {},
        function b () {}
      ])
    ])

    assert.equal(tree.length, 1)
    assert.equal(tree[0].items[0].name, 'a')
    assert.equal(tree[0].items[0].functionIndex, 0)
    assert.equal(tree[0].items[0].isParallel, true)
    assert.ok(tree[0].items[0].function)
    assert.equal(tree[0].items[1].name, 'b')
    assert.equal(tree[0].items[1].functionIndex, 1)
    assert.equal(tree[0].items[1].isParallel, true)
    assert.ok(tree[0].items[1].function)
  })
  it('should identify parallel execution at root', () => {
    const tree = staticTree([
      new All([
        function a () {},
        function b () {}
      ])
    ])

    assert.equal(tree.length, 1)
    assert.equal(tree[0]._isAll, true)
    assert.equal(tree[0].items[0].functionIndex, 0)
    assert.equal(tree[0].items[0].isParallel, true)
    assert.ok(tree[0].items[0].function)
    assert.equal(tree[0].items[1].name, 'b')
    assert.equal(tree[0].items[1].functionIndex, 1)
    assert.equal(tree[0].items[1].isParallel, true)
    assert.ok(tree[0].items[1].function)
  })
})
