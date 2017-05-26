/* eslint-env mocha */
import { FirebaseProviderError, FirebaseProviderAuthenticationError } from './'
import assert from 'assert'

describe('errors', () => {
  it('should have base error', () => {
    const error = new FirebaseProviderError(new Error('foo'))

    assert.ok(error instanceof Error)
    assert.equal(error.message, 'foo')
    assert.ok(error.stack)
    assert.equal(error.toJSON().name, 'FirebaseProviderError')
    assert.equal(error.toJSON().message, 'foo')
    assert.ok(error.toJSON().stack)
  })
  it('should have extended authentication error', () => {
    const baseError = new Error('foo')
    baseError.code = 202
    const error = new FirebaseProviderAuthenticationError(baseError)

    assert.ok(error instanceof Error)
    assert.ok(error instanceof FirebaseProviderError)
    assert.equal(error.message, 'foo')
    assert.equal(error.code, 202)
    assert.ok(error.stack)
    assert.equal(error.toJSON().name, 'FirebaseProviderAuthenticationError')
    assert.equal(error.toJSON().message, 'foo')
    assert.equal(error.toJSON().code, 202)
    assert.ok(error.toJSON().stack)
  })
})
