import { createReturnPromise } from '../helpers'

function getDownloadURLFactory(filepath, file) {
  function getDownloadURL({ firebase, props, path, resolve }) {
    return createReturnPromise(
      firebase.getDownloadURL(resolve.value(filepath), resolve.value(file)),
      path
    )
  }

  return getDownloadURL
}

export default getDownloadURLFactory
