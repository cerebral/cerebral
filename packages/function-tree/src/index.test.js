/* eslint-env mocha */
import FunctionTreeExecution from './'
import assert from 'assert'

describe('FunctionTreeExecution', () => {
  describe('execution.abort()', () => {
    it('should stop if aborted from sync action', (done) => {
      const runTree = FunctionTreeExecution([])
      runTree.on('abort', () => done())

      runTree([
        ({execution}) => {
          return execution.abort()
        },
        ({execution}) => {
          done(new Error('Should not continue execution.'))
        }
      ])
    })
    it('should stop if aborted from async action', (done) => {
      const runTree = FunctionTreeExecution([])
      runTree.on('abort', () => done())

      runTree([
        ({execution}) => {
          return Promise.resolve(execution.abort())
        },
        ({execution}) => {
          done(new Error('Should not continue execution.'))
        }
      ])
    })
    it('should pass final payload in event', (done) => {
      const runTree = FunctionTreeExecution([])
      runTree.on('abort', (execution, funcDetails, result) => {
        assert.deepEqual(result, {prop1: 'value', prop2: 'updated'})
        done()
      })

      runTree([
        ({execution}) => {
          return Promise.resolve(execution.abort({prop2: 'updated'}))
        }
      ], {prop1: 'value', prop2: 'value'})
    })
  })
})
