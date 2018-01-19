import { createStorageRef } from './helpers'

export default function getDownloadURL(path, file) {
  const ref = createStorageRef(path).child(file)

  return ref.getDownloadURL()
}
