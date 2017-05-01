export default class HttpProviderError extends Error {
  constructor (status, headers, body, message = null, isAborted = false) {
    super()
    this.name = 'HttpProviderError'
    this.message = message
    this.status = status
    this.headers = headers
    this.body = body
    this.isAborted = isAborted
  }
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      headers: this.headers,
      body: this.body,
      isAborted: this.isAborted
    }
  }
}
