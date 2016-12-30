import {unset} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath} = paths(moduleName)
  return [
    unset(state`${draftPath}.key`),
    unset(state`${draftPath}`)
  ]
}
