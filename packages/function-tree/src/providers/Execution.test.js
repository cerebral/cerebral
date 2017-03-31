/* eslint-env mocha */
import FunctionTree from '../'
import assert from 'assert'

describe('ExecutionProvider', () => {
  it('should expose the instance on the context', () => {
    const ft = new FunctionTree()

    ft.run('something', [
      ({execution}) => {
        assert.equal(execution.name, 'something')
        assert.ok(execution.id)
        assert.ok(execution.datetime)
        assert.ok(execution.staticTree)
      }
    ])
  })
  it('should be able to retry execution', () => {
    const ft = new FunctionTree()
    let count = 0

    function funcA () {
      return new Promise(resolve => {
        resolve()
      })
    }

    function funcB ({input, execution}) {
      if (input.retryCount < 3) {
        count++
        return execution.retry({
          retryCount: input.retryCount + 1
        })
      }
    }

    ft.run([
      funcA,
      funcB
    ], {
      retryCount: 0
    }, () => {
      assert.equal(count, 3)
    })
  })
  it('should be able to abort execution', () => {
    const ft = new FunctionTree()
    let count = 0

    function funcA ({execution}) {
      return execution.abort()
    }

    function funcB () {
      count++
    }

    ft.on('abort', () => {
      assert.equal(count, 0)
    })
    ft.run([
      funcA,
      funcB
    ])
  })
})
