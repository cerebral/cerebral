import {merge, set, state} from 'cerebral/operators'
import makeRef from '../operators/makeRef'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath, filterPath} = paths(moduleName)
  return [
    // Prepare initial item state
    set(state`${draftPath}`, {}),
    merge(state`${draftPath}`, {
      key: makeRef,
      name: state`${filterPath}`
    })
  ]
}
