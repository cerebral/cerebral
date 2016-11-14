import {
  createRef
} from './helpers'

export default function remove (path) {
  const ref = createRef(path)
  return ref.remove()
          .then(() => ({}))
          .catch((error) => ({error: error.message}))
}
