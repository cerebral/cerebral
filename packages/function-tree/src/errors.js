export class FunctionTreeError extends Error {
  constructor (error) {
    super(error.message)
    this.name = 'FunctionTreeError'
  }
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
    }
  }
}

export class FunctionTreeExecutionError extends FunctionTreeError {
  constructor (execution, funcDetails, payload, error) {
    super(error)
    this.name = 'FunctionTreeExecutionError'
    this.execution = execution
    this.funcDetails = funcDetails
    this.payload = payload
  }
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      execution: {
        name: this.execution.name
      },
      funcDetails: {
        name: this.funcDetails.name,
        functionIndex: this.funcDetails.functionIndex
      },
      payload: this.payload,
      stack: this.stack
    }
  }
}
