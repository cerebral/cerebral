import {set, when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath, dynamicPaths} = paths(moduleName)

  return [
    ...dynamicPaths,

    set(state`${props`itemPath`}`, props`value`),

    when(state`${draftPath}.key`, props`key`,
      (draftKey, updatedKey) => draftKey === updatedKey
    ), {
      true: [
        set(state`${draftPath}`, props`value`)
      ],
      false: []
    }
  ]
}
