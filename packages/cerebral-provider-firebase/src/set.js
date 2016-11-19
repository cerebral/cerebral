import {
  createRef
} from './helpers'

export default function set (path, payload) {
  const ref = createRef(path)
  return ref.set(payload)
    .then(() => ({}))
    .catch((error) => ({error: error.message}))
}
