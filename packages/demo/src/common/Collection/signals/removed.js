import {unset} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)
  return [
    ...dynamicPaths,
    unset(state`${input`itemPath`}`)
  ]
}
