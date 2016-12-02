import {
  createRef
} from './helpers'

export default function push (path, payload) {
  const ref = createRef(path)
  const newItem = ref.push()
  return new Promise((resolve, reject) => {
    newItem.set(payload)
    .then(
      () => resolve({key: newItem.key}),
      (error) => reject({error: error.message})
    )
  })
}
