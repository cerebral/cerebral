import {
  createRef
} from './helpers'
import {FirebaseProviderError} from './errors'

let ref = null

export function setOnDisconnect (path, value) {
  if (ref) {
    throw new FirebaseProviderError('You have already a setOnDisconnect')
  }

  ref = createRef(path)
  ref.onDisconnect().set(value)
}

export function cancelOnDisconnect () {
  if (!ref) {
    throw new FirebaseProviderError('You have no setOnDisconnect')
  }

  ref.onDisconnect().cancel()
  ref = null
}
