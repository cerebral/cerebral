import {FunctionTreeExecutionError} from '../errors'

export default function StopExecutionProviderFactory (conditions = {}) {
  return function StopExecutionProvider (context, funcDetails, payload) {
    if (conditions[context.execution.name] && conditions[context.execution.name](context)) {
      throw new FunctionTreeExecutionError(context.execution, funcDetails, payload, new Error('Execution stopped by condition'))
    }

    return context
  }
}
