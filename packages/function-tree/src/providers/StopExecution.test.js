/* eslint-env mocha */
import FunctionTree, {FunctionTreeExecutionError} from '../'
import StopExecution from './StopExecution'
import assert from 'assert'

describe('StopExecutionProvider', () => {
  it('should throw error when conditions are not met', (done) => {
    const ft = new FunctionTree([
      StopExecution({
        test (context) { return context.props.doStop }
      })
    ])

    ft.run('test', {
      doStop: true
    }, [
      ({props}) => {
        done(new Error('Should not run'))
      }
    ])
      .catch((error) => {
        assert.ok(error instanceof FunctionTreeExecutionError)
        done()
      })
  })
})
