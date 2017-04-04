/* eslint-env mocha */
import FunctionTreeExecution from './'
import assert from 'assert'

describe('FunctionTreeExecution', () => {
  describe('throwing errors', () => {
    it('should stop if throw error from sync action', (done) => {
      const runTree = FunctionTreeExecution([])

      runTree([
        ({execution}) => {
          throw new Error()
        },
        ({execution}) => {
          done(new Error('Should not continue execution.'))
        }
      ])
      .catch(() => {
        done()
      })
    })
    it('should stop if throw from async action', (done) => {
      const runTree = FunctionTreeExecution([])

      runTree([
        ({execution}) => {
          return Promise.reject(new Error())
        },
        ({execution}) => {
          done(new Error('Should not continue execution.'))
        }
      ])
      .catch(() => {
        done()
      })
    })
    it('should pass error with payload property', (done) => {
      const runTree = FunctionTreeExecution([])

      runTree([
        ({execution}) => {
          return Promise.reject(new Error('wuuut'))
        }
      ], {prop1: 'value', prop2: 'value'})
      .catch((error) => {
        assert.equal(error.message, 'wuuut')
        assert.equal(error.payload.error.name, 'Error')
        assert.equal(error.payload.error.message, 'wuuut')
        done()
      })
    })
    it('should throw to console if not catch handler', (done) => {
      const runTree = FunctionTreeExecution([])

      process.on('unhandledRejection', function handleRejection () {
        process.removeListener('unhandledRejection', handleRejection)
        done()
      })

      runTree([
        ({execution}) => {
          throw new Error()
        },
        ({execution}) => {
          done(new Error('Should not continue execution.'))
        }
      ])
    })
    it('should use error toJSON, if available, to serialize error', (done) => {
      const runTree = FunctionTreeExecution([])

      class CustomError {
        constructor (message) {
          this.name = 'CustomError'
          this.message = message
        }
        toJSON () {
          return this.message
        }
      }
      runTree([
        () => {
          throw new CustomError('foo')
        }
      ], {})
      .catch((error) => {
        assert.ok(error instanceof CustomError)
        assert.equal(error.payload.error, 'foo')
        done()
      })
    })
  })
})
