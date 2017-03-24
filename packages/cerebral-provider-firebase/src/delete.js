import {
  createStorageRef
} from './helpers'

export default function deleteOp (path, filename) {
  const ref = createStorageRef(path).child(filename)

  return ref.delete().then(() => undefined)
}
