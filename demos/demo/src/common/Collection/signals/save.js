import {set} from 'cerebral/operators'
import {props} from 'cerebral/tags'
import {set as setRemote} from 'cerebral-provider-firebase'
import paths from '../paths'
import timestampValue from './timestampValue'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)
  return [
    // Expects props.key and props.value
    // Ensure value.key is properly set.
    set(props`value.key`, props`key`),
    ...timestampValue,
    ...dynamicPaths,
    setRemote(props`remoteItemPath`, props`value`)
    // This chain must be followed by {success: [], error: []}
  ]
}
