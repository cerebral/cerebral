import {set, when} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import * as firebase from 'cerebral-provider-firebase'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths, errorPath} = paths(moduleName)
  return [
    ...dynamicPaths,
    set(input`filename`, state`${input`itemPath`}.imageName`),
    firebase.remove(input`remoteItemPath`), {
      success: [
        when(input`filename`), {
          true: [
            firebase.delete(
              input`remoteItemImagePath`,
              input`filename`
            ), {
              success: [],
              error: [
                set(state`${errorPath}`, input`error`)
              ]
            }
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
