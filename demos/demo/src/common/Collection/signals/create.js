import newItem from './newItem'
import update from './update'

export default function (moduleName) {
  return [
    ...newItem(moduleName),
    ...update(moduleName)
  ]
}
