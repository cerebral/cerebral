import {unset} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)
  return [
    ...dynamicPaths,
    unset(state`${props`itemPath`}`)
  ]
}
