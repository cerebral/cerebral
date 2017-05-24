import {merge, set, when} from 'cerebral/operators'
import {props, signal, state} from 'cerebral/tags'
import * as firebase from '@cerebral/firebase/operators'
import paths from '../paths'

export default function init (moduleName, initState = {}) {
  const {collectionPath, dynamicPaths, errorPath} = paths(moduleName)
  return [
    // prepare remote and local path
    ...dynamicPaths,
    () => {
      // set props.timestamp before calling value
      return {timestamp: (new Date()).getTime()}
    },
    firebase.value(props`remoteCollectionPath`), {
      success: [
        // need to use 'merge' here to notify changes on default item keys
        merge(state`${collectionPath}`, initState),
        when(props`value`), {
          true: [
            merge(state`${collectionPath}`, props`value`)
          ],
          false: []
        },
        // start listening
        firebase.onChildAdded(
          props`remoteCollectionPath`, signal`${moduleName}.updated`,
          {
            orderByChild: 'updated_at',
            // Use the timestamp set before getting value
            startAt: props`timestamp`
          }
        ),
        firebase.onChildChanged(
          props`remoteCollectionPath`, signal`${moduleName}.updated`),
        firebase.onChildRemoved(
          props`remoteCollectionPath`, signal`${moduleName}.removed`)
      ],
      error: [
        set(state`${errorPath}`, props`error`)
      ]
    }
  ]
}
