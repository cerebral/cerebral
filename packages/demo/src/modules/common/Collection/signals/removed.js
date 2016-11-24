import {input, state, unset} from 'cerebral/operators'
import {setPaths} from '../paths'

export default function (moduleName) {
  return [
    ...setPaths(moduleName),
    unset(state`${input`itemPath`}`)
  ]
}
