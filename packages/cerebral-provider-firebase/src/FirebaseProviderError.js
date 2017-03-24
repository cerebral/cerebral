export default class FirebaseProviderError extends Error {
  constructor (message) {
    super()
    this.name = 'FirebaseError'
    this.message = message
  }
}
