/* eslint-env mocha */
import {HttpProviderError} from './'
import assert from 'assert'

describe('errors', () => {
  it('should have base error', () => {
    const error = new HttpProviderError(200, {foo: 'bar'}, 'foo')

    assert.ok(error instanceof Error)
    assert.ok(error.stack)
    assert.equal(error.toJSON().name, 'HttpProviderError')
    assert.equal(error.toJSON().status, 200)
    assert.deepEqual(error.toJSON().headers, {foo: 'bar'})
    assert.equal(error.toJSON().body, 'foo')
    assert.equal(error.toJSON().isAborted, false)
  })
})
