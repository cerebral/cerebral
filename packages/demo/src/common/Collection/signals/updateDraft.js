import {input, set, state} from 'cerebral/operators'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath} = paths(moduleName)
  return [
    set(state`${draftPath}.${input`key`}`, input`value`)
  ]
}
