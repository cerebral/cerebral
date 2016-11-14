import {
  createRef
} from './helpers'

export default function update (path, payload) {
  const ref = createRef(path)
  return ref.update(payload)
          .then(() => ({}))
          .catch((error) => ({error: error.message}))
}
