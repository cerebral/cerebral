import { set } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import paths from '../paths'

export default function(moduleName) {
  const { draftPath, dynamicPaths } = paths(moduleName)
  return [
    dynamicPaths,
    set(state`${draftPath}`, state`${props`itemPath`}`),
    // To trigger change on collection list listening for
    // draft.key
    set(state`${draftPath}.key`, props`key`),
  ]
}
