import {input, set, state} from 'cerebral/operators'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)

  return [
    ...dynamicPaths,
    set(state`${input`itemPath`}.$imageProgress`, input`progress`)
  ]
}
