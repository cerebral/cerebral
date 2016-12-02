import {
  createRef
} from './helpers'

export default function value (path, options) {
  const ref = createRef(path, options)
  return new Promise((resolve, reject) => {
    ref.once('value')
    .then(
      (snapshot) => resolve({key: snapshot.key, value: snapshot.val()}),
      (error) => reject({error: error.message})
    )
  })
}
