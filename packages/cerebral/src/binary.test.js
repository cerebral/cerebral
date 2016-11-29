/* eslint-env mocha */
import binary from './binary'
import assert from 'assert'

describe('binary', () => {
  it('create new reference on each run', () => {
    const obj = {}
    const ref1 = binary.push(obj)
    const ref2 = binary.push(obj)
    assert.ok(ref1 !== ref2)
  })
  it('retrieves original element with ref', () => {
    const obj = {}
    const ref = binary.push(obj)
    const objBack = binary.pop(ref)
    assert.equal(obj, objBack)
  })
  it('removes element on pop', () => {
    const ref = binary.push({})
    binary.pop(ref)
    assert.equal(undefined, binary.pop(ref))
  })
  it('supports fixed reference to replace object', () => {
    const obj = {}
    const ref1 = binary.push(obj, 'myUniqueRef')
    const ref2 = binary.push(obj, 'myUniqueRef')
    assert.ok(ref1 === ref2)
  })
})
