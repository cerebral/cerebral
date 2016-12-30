import {merge, set, when} from 'cerebral/operators'
import {input, signal, state} from 'cerebral/tags'
import {onChildAdded, onChildChanged, onChildRemoved, value} from 'cerebral-provider-firebase'
import paths from '../paths'

export default function init (moduleName, initState = {}) {
  const {collectionPath, dynamicPaths, errorPath} = paths(moduleName)
  return [
    // prepare remote and local path
    ...dynamicPaths,
    () => {
      // set input.timestamp before calling value
      return {timestamp: (new Date()).getTime()}
    },
    value(input`remoteCollectionPath`), {
      success: [
        // need to use 'merge' here to notify changes on default item keys
        merge(state`${collectionPath}`, initState),
        when(input`value`), {
          true: [
            merge(state`${collectionPath}`, input`value`)
          ],
          false: []
        },
        // start listening
        onChildAdded(
          input`remoteCollectionPath`, signal`${moduleName}.updated`,
          {
            orderByChild: 'updated_at',
            // Use the timestamp set before getting value
            startAt: input`timestamp`
          }
        ),
        onChildChanged(
          input`remoteCollectionPath`, signal`${moduleName}.updated`),
        onChildRemoved(
          input`remoteCollectionPath`, signal`${moduleName}.removed`)
      ],
      error: [
        set(state`${errorPath}`, input`error`)
      ]
    }
  ]
}
