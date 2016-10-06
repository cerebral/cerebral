import {
  createRef
} from './helpers'

export default function value (path, options) {
  const ref = createRef(path, options)
  return ref.once('value')
    .then((snapshot) => {
      return {
        key: snapshot.key,
        value: snapshot.val()
      }
    })
    .catch((err) => {
      throw { // eslint-disable-line
        error: err.message
      }
    })
}
