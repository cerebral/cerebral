import {input, set, state} from 'cerebral/operators'
import {paths, setPaths} from '../paths'

export default function (moduleName) {
  const {draftPath} = paths(moduleName)
  return [
    setPaths(moduleName),
    set(state`${draftPath}`, state`${input`itemPath`}`),
    // To trigger change on collection list listening for
    // draft.key
    set(state`${draftPath}.key`, input`key`)
  ]
}
