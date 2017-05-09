export class FirebaseAdminError extends Error {
  constructor (error) {
    super(error.message)
    this.name = 'FirebaseAdminError'
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
