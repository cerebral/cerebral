import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)

  return [
    ...dynamicPaths,
    set(state`${input`itemPath`}.$imageProgress`, input`progress`)
  ]
}
