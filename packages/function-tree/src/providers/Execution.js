import executeTree from '../executeTree'

export default function ExecutionProvider (execution, Abort) {
  return (context) => {
    context.execution = execution
    context.execution.retry = (payload) => {
      return new Promise((resolve) => {
        executeTree(execution.staticTree, execution.runFunction, payload, resolve)
      })
    }
    context.execution.abort = (payload) => {
      return new Abort(payload)
    }

    return context
  }
}
