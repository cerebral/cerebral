import {input, set, state, when} from 'cerebral/operators'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath, dynamicPaths} = paths(moduleName)

  return [
    ...dynamicPaths,

    set(state`${input`itemPath`}`, input`value`),

    when(state`${draftPath}.key`, input`key`,
      (draftKey, updatedKey) => draftKey === updatedKey
    ), {
      true: [
        set(state`${draftPath}`, input`value`)
      ],
      false: []
    }
  ]
}
