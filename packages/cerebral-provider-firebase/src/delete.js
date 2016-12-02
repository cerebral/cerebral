import {
  createStorageRef
} from './helpers'

export default function deleteOp (path, filename) {
  const ref = createStorageRef(path).child(filename)
  return new Promise((resolve, reject) => {
    ref.delete().then(
      () => resolve({}),
      (error) => reject({error: error.message})
    )
  })
}
