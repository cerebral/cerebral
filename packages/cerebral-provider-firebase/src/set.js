import {
  createRef
} from './helpers'

export default function set (path, payload) {
  const ref = createRef(path)
  return new Promise((resolve, reject) => {
    ref.set(payload).then(
      () => resolve({}),
      (error) => reject({error: error.message})
    )
  })
}
