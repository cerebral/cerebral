/* eslint-env mocha */
import FunctionTreeExecution from './'

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
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(execution.abort())
            }, 1)
          })
        },
        ({execution}) => {
          done(new Error('Should not continue execution.'))
        }
      ])
    })
  })
})
