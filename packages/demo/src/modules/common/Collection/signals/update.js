import {input, set, state, unset} from 'cerebral/operators'
import {set as setRemote} from 'cerebral-provider-firebase'
import {paths, setPaths} from './paths'
import timestampValue from './timestampValue'

export default function (moduleName) {
  const {draftPath, errorPath} = paths(moduleName)
  return [
    set(input`key`, state`${draftPath}.key`),
    set(input`value`, state`${draftPath}`),
    ...timestampValue,
    ...setPaths(moduleName),
    setRemote(input`remoteItemPath`, input`value`), {
      success: [
        // Clear form.
        unset(state`${draftPath}.key`)
        // FIXME: Would be nice if we could clear draft but then path change notification is for draft...
        // , unset(state`${draftPath}`)
      ],
      error: [
        set(state`${errorPath}`)
      ]
    }
  ]
}
