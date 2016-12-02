import {input, set, state, when} from 'cerebral/operators'
import * as firebase from 'cerebral-provider-firebase'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths, errorPath} = paths(moduleName)
  return [
    ...dynamicPaths,
    set(input`fileName`, state`${input`itemPath`}.imageName`),
    firebase.remove(input`remoteItemPath`), {
      success: [
        when(input`fileName`), {
          true: [
            firebase.delete(
              input`remoteItemImagePath`,
              input`fileName`
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
