import {set} from 'cerebral/operators'
import {input} from 'cerebral/tags'
import {set as setRemote} from 'cerebral-provider-firebase'
import paths from '../paths'
import timestampValue from './timestampValue'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)
  return [
    // Expects input.key and input.value
    // Ensure value.key is properly set.
    set(input`value.key`, input`key`),
    ...timestampValue,
    ...dynamicPaths,
    setRemote(input`remoteItemPath`, input`value`)
    // This chain must be followed by {success: [], error: []}
  ]
}
