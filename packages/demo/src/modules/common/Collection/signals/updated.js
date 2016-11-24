import {input, set, state} from 'cerebral/operators'
import {setPaths} from '../paths'

export default function (moduleName) {
  return [
    ...setPaths(moduleName),
    set(state`${input`itemPath`}`, input`value`)
  ]
}
