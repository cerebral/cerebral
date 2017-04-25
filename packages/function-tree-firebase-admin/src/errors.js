export class FirebaseProviderError extends Error {
  constructor (error) {
    super(error.message)
    this.name = 'FirebaseProviderError'
    this.message = error.message
  }
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
    }
  }
}
