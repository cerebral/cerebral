export class FirebaseProviderError extends Error {
  constructor (error) {
    super()
    this.name = 'FirebaseProviderError'
    this.message = error.message
  }
}

export class FirebaseProviderAuthenticationError extends Error {
  constructor (message) {
    super()
    this.name = 'FirebaseProviderAuthenticationError'
    this.message = message
    this.code = error.code
  }
}
