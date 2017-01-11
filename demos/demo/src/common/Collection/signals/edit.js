import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath, dynamicPaths} = paths(moduleName)
  return [
    dynamicPaths,
    set(state`${draftPath}`, state`${input`itemPath`}`),
    // To trigger change on collection list listening for
    // draft.key
    set(state`${draftPath}.key`, input`key`)
  ]
}
