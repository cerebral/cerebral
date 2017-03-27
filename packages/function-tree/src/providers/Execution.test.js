/* eslint-env mocha */
import FunctionTree from '../'
import assert from 'assert'

describe('ExecutionProvider', () => {
  it('should expose the instance on the context', () => {
    const execute = FunctionTree()

    execute('something', [
      ({execution}) => {
        assert.equal(execution.name, 'something')
        assert.ok(execution.id)
        assert.ok(execution.datetime)
        assert.ok(execution.staticTree)
      }
    ])
  })
  it('should be able to retry execution', (done) => {
    const execute = FunctionTree()
    let count = 0

    function funcA () {
      return Promise.resolve()
    }

    function funcB ({props, execution}) {
      if (props.retryCount < 3) {
        count++
        return execution.retry({
          retryCount: props.retryCount + 1
        })
      }
    }

    execute([
      funcA,
      funcB
    ], {
      retryCount: 0
    }, () => {
      assert.equal(count, 3)
      done()
    })
  })
  it('should be able to abort execution', () => {
    const execute = FunctionTree()
    let count = 0

    function funcA ({execution}) {
      return execution.abort()
    }

    function funcB () {
      count++
    }

    execute.on('abort', () => {
      assert.equal(count, 0)
    })
    execute([
      funcA,
      funcB
    ])
  })
})
