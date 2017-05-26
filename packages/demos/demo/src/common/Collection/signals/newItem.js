import { merge, set } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import makeRef from '../actions/makeRef'
import paths from '../paths'

export default function(moduleName) {
  const { draftPath, filterPath } = paths(moduleName)
  return [
    // Prepare initial item state
    set(state`${draftPath}`, {}),
    makeRef,
    merge(state`${draftPath}`, {
      key: props`ref`,
      name: state`${filterPath}`,
    }),
  ]
}
