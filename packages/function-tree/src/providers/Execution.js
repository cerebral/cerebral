import executeTree from '../executeTree'

export default function ExecutionProvider (execution, Abort) {
  return (context) => {
    context.execution = execution
    context.execution.retry = (payload) => {
      return new Promise((resolve) => {
        executeTree(execution.staticTree, execution.runFunction, payload, resolve)
      })
    }
    context.execution.abort = () => {
      return new Abort()
    }

    return context
  }
}
