import { set, when } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import * as firebase from '@cerebral/firebase/operators'
import paths from '../paths'

export default function(moduleName) {
  const { dynamicPaths, errorPath } = paths(moduleName)
  return [
    ...dynamicPaths,
    set(props`filename`, state`${props`itemPath`}.imageName`),
    firebase.remove(props`remoteItemPath`),
    {
      success: [
        when(props`filename`),
        {
          true: [
            firebase.delete(props`remoteItemImagePath`, props`filename`),
            {
              success: [],
              error: [set(state`${errorPath}`, props`error`)],
            },
          ],
          false: [],
        },
      ],
      error: [set(state`${errorPath}`, props`error`)],
    },
  ]
}
