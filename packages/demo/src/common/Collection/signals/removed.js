import {input, state, unset} from 'cerebral/operators'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)
  return [
    ...dynamicPaths,
    unset(state`${input`itemPath`}`)
  ]
}
