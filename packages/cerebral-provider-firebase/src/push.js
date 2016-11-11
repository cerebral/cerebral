import {
  createRef
} from './helpers'

export default function push (path, payload) {
  const ref = createRef(path)
  const newItem = ref.push()
  return newItem.set(payload)
    .then(() => {
      return {
        key: newItem.key
      }
    })
    .catch((err) => {
      throw { // eslint-disable-line
        error: err.message
      }
    })
}
