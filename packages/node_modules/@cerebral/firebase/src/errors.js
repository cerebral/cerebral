export class FirebaseProviderError extends Error {
  constructor(error) {
    super(error.message)
    this.name = 'FirebaseProviderError'
    this.message = error.message
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    }
  }
}

export class FirebaseProviderAuthenticationError extends FirebaseProviderError {
  constructor(error) {
    super(error)
    this.name = 'FirebaseProviderAuthenticationError'
    this.message = error.message
    this.code = error.code
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack,
    }
  }
}
