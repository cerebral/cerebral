import {set, unset, when} from 'cerebral/operators'
import {props, signal, state} from 'cerebral/tags'
import * as firebase from '@cerebral/firebase/operators'
import paths from '../paths'
import save from './save'

export default function update (moduleName) {
  const {draftPath, dynamicPaths, errorPath} = paths(moduleName)

  // FIXME: remove once unset works on `props`
  const unsetTmp = ({props}) => {
    const value = Object.assign({}, props.value)
    delete value['$imageFile']
    delete value['$imageProgress']
    return {value}
  }

  return [
    set(props`key`, state`${draftPath}.key`),
    ...dynamicPaths,
    set(props`value`, state`${draftPath}`),
    // make sure we do not include these two fields
    unsetTmp,
    /*
    unset(props`value.$imageFile`),
    unset(props`value.$imageProgress`),
    */
    set(props`imageFile`, state`${draftPath}.$imageFile`),

    // Clear form (avoid updated notify back to the form).
    unset(state`${draftPath}.key`),
    ...save(moduleName), {
      success: [
        // Upload new image if we have one
        when(props`imageFile`), {
          true: [
            firebase.put(
              props`remoteItemImagePath`,
              props`imageFile`,
              {
                progress: signal`${moduleName}.uploadProgress`
              }
            ), {
              success: [
                // Get latest (fresh) value
                set(props`value`, state`${props`itemPath`}`),
                set(props`value.image`, props`url`),
                when(
                  props`value.imageName`, props`filename`,
                  (oldName, newName) => oldName && newName !== oldName
                ), {
                  true: [
                    // Delete previous image
                    firebase.delete(
                      props`remoteItemImagePath`,
                      props`value.imageName`
                    ), {
                      success: [],
                      error: [
                        set(state`${errorPath}`, props`error`)
                      ]
                    }
                  ],
                  false: []
                },
                set(props`value.imageName`, props`filename`),
                unsetTmp,
                /*
                unset(props`value.$imageProgress`),
                unset(props`value.$imageFile`),
                */
                // New image uploaded, save item with updated url for image
                ...save(moduleName), {
                  success: [],
                  error: [
                    set(state`${errorPath}`, props`error`)
                  ]
                }
              ],
              error: [
                set(state`${errorPath}`, props`error`)
              ]
            }
          ],
          false: []
        }
      ],
      error: [
        set(state`${errorPath}`, props`error`)
      ]
    }
  ]
}
