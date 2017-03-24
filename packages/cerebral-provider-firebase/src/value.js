import {
  createRef
} from './helpers'

export default function value (path, options) {
  const ref = createRef(path, options)

  return ref.once('value').then((snapshot) => ({key: snapshot.key, value: snapshot.val()}))
}
