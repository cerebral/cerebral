import {input, merge, set, state, when} from 'cerebral/operators'
import {onChildAdded, onChildChanged, onChildRemoved, value} from 'cerebral-provider-firebase'
import {paths, setPaths} from '../paths'

export default function init (moduleName, initState = {}) {
  const {collectionPath, errorPath} = paths(moduleName)
  return [
    // prepare remote and local path
    ...setPaths(moduleName),
    // start listening
    onChildAdded(
      input`remoteCollectionPath`, `${moduleName}.updated`),
    onChildChanged(
      input`remoteCollectionPath`, `${moduleName}.updated`),
    onChildRemoved(
      input`remoteCollectionPath`, `${moduleName}.removed`),

    value(input`remoteCollectionPath`), {
      success: [
        set(state`${collectionPath}`, initState),
        when(input`value`), {
          true: [
            merge(state`${collectionPath}`, input`value`)
          ],
          false: []
        }
      ],
      error: [
        set(state`${errorPath}`, input`error`)
      ]
    }
  ]
}
