import {input, set, state, when} from 'cerebral/operators'
import makeRef from '../operators/makeRef'
import paths from '../paths'

export default function (moduleName) {
  const {draftPath, filterPath} = paths(moduleName)
  return [
    when(input`key`), {
      true: [],
      false: [
        set(input`key`, makeRef)
      ]
    },
    // Prepare initial item state
    when(input`value`), {
      true: [],
      false: [
        set(input`value`, {}),
        set(input`value.name`, state`${filterPath}`)
      ]
    },
    set(input`value.key`, input`key`),
    set(state`${draftPath}`, input`value`),
    // To trigger form update
    set(state`${draftPath}.key`, input`key`)
  ]
}
