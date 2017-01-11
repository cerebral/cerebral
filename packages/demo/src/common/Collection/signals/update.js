// import {upload} from 'cerebral-provider-firebase'
import {set, unset, when} from 'cerebral/operators'
import {input, signal, state} from 'cerebral/tags'
import * as firebase from 'cerebral-provider-firebase'
import paths from '../paths'
import save from './save'

export default function update (moduleName) {
  const {draftPath, dynamicPaths, errorPath} = paths(moduleName)

  // FIXME: remove once unset works on `input`
  const unsetTmp = ({input}) => {
    const value = Object.assign({}, input.value)
    delete value['$imageFile']
    delete value['$imageProgress']
    return {value}
  }

  return [
    set(input`key`, state`${draftPath}.key`),
    ...dynamicPaths,
    set(input`value`, state`${draftPath}`),
    // make sure we do not include these two fields
    unsetTmp,
    /*
    unset(input`value.$imageFile`),
    unset(input`value.$imageProgress`),
    */
    set(input`imageFile`, state`${draftPath}.$imageFile`),

    // Clear form (avoid updated notify back to the form).
    unset(state`${draftPath}.key`),
    ...save(moduleName), {
      success: [
        // Upload new image if we have one
        when(input`imageFile`), {
          true: [
            firebase.put(
              input`remoteItemImagePath`,
              input`imageFile`,
              {
                progress: signal`${moduleName}.uploadProgress`
              }
            ), {
              success: [
                // Get latest (fresh) value
                set(input`value`, state`${input`itemPath`}`),
                set(input`value.image`, input`url`),
                when(
                  input`value.imageName`, input`filename`,
                  (oldName, newName) => oldName && newName !== oldName
                ), {
                  true: [
                    // Delete previous image
                    firebase.delete(
                      input`remoteItemImagePath`,
                      input`value.imageName`
                    ), {
                      success: [],
                      error: [
                        set(state`${errorPath}`, input`error`)
                      ]
                    }
                  ],
                  false: []
                },
                set(input`value.imageName`, input`filename`),
                unsetTmp,
                /*
                unset(input`value.$imageProgress`),
                unset(input`value.$imageFile`),
                */
                // New image uploaded, save item with updated url for image
                ...save(moduleName), {
                  success: [],
                  error: [
                    set(state`${errorPath}`, input`error`)
                  ]
                }
              ],
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
