import {
  createRef
} from './helpers'

let ref = null

export function setOnDisconnect (path, value) {
  if (ref) {
    throw new Error('cerebral-provider-firebase: You have already set a disconnect')
  }

  ref = createRef(path)
  ref.onDisconnect().set(value)
}

export function cancelOnDisconnect () {
  if (!ref) {
    throw new Error('cerebral-provider-firebase: You have no set to disconnect')
  }

  ref.onDisconnect().cancel()
  ref = null
}
