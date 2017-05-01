import {set, when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import paths from '../paths'

const MAX_IMAGE_SIZE = 100 * 1024

const checkImageSize = (key, value) => {
  if (key === '$imageFile' && value.size > MAX_IMAGE_SIZE) {
    return false
  }
  return true
}

export default function (moduleName) {
  const {draftPath, errorPath} = paths(moduleName)
  return [
    when(props`key`, props`value`, checkImageSize), {
      true: [
        set(state`${draftPath}.${props`key`}`, props`value`)
      ],
      false: [
        set(state`${errorPath}`, 'image exceeds maximum size of 100 KB')
      ]
    }
  ]
}
