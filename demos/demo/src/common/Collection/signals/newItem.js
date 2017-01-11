import {merge, set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import makeRef from '../actions/makeRef'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath, filterPath} = paths(moduleName)
  return [
    // Prepare initial item state
    set(state`${draftPath}`, {}),
    makeRef,
    merge(state`${draftPath}`, {
      key: input`ref`,
      name: state`${filterPath}`
    })
  ]
}
