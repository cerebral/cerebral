import {input, set, state} from 'cerebral/operators'
import paths from '../paths'

export default function (moduleName) {
  const {filterPath} = paths(moduleName)
  return [
    set(state`${filterPath}`, input`value`)
  ]
}
