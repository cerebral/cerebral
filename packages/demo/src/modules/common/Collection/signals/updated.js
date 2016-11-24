import {input, set, state} from 'cerebral/operators'
import {paths, setPaths} from '../paths'

export default function (moduleName) {
  const {draftPath} = paths(moduleName)

  return [
    ...setPaths(moduleName),

    set(state`${input`itemPath`}`, input`value`),

/*
    when(state`${draftPath}.key`, input`key`,
      (draftKey, updatedKey) => draftKey === updatedKey
    ), {
    */
    ({state, input, path}) => {
      return state.get(`${draftPath}.key`) === input.key
        ? path.true() : path.false()
    }, {
      true: [
        set(state`${draftPath}`, input`value`)
      ],
      false: []
    }
  ]
}
