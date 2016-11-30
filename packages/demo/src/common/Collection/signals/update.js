import {input, set, state, unset} from 'cerebral/operators'
import paths from '../paths'
import save from './save'

export default function (moduleName) {
  const {draftPath, errorPath} = paths(moduleName)
  const p = [
    set(input`key`, state`${draftPath}.key`),
    set(input`value`, state`${draftPath}`),
    ...save(moduleName), {
      success: [
        // Clear form.
        unset(state`${draftPath}.key`)
      ],
      error: [
        set(state`${errorPath}`, input`error`)
      ]
    }
  ]
  return p
}
