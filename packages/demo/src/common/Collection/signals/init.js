import {input, merge, set, state, when} from 'cerebral/operators'
import {onChildAdded, onChildChanged, onChildRemoved, value} from 'cerebral-provider-firebase'
import paths from '../paths'

let timestamp

export default function init (moduleName, initState = {}) {
  const {collectionPath, dynamicPaths, errorPath} = paths(moduleName)
  return [
    // prepare remote and local path
    ...dynamicPaths,
    () => {
      // timestamp before calling value
      timestamp = (new Date()).getTime()
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
          input`remoteCollectionPath`, `${moduleName}.updated`,
          {
            orderByChild: 'updated_at',
            // Use the timestamp set before getting value
            startAt: () => ({value: timestamp})
          }
        ),
        onChildChanged(
          input`remoteCollectionPath`, `${moduleName}.updated`),
        onChildRemoved(
          input`remoteCollectionPath`, `${moduleName}.removed`)
      ],
      error: [
        set(state`${errorPath}`, input`error`)
      ]
    }
  ]
}
