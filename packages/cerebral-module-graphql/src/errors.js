export class GraphQlModuleError extends Error {
  constructor (message) {
    super(message)
  }
  toJSON () {
    return {
      name: 'GraphQlModuleError',
      message: this.message,
      stack: this.stack
    }
  }
}
