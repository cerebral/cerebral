export default class HttpProviderError extends Error {
  constructor (message) {
    super()
    this.name = 'HttpProviderError'
    this.message = message
  }
}
