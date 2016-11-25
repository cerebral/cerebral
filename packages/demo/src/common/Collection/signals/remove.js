import {input} from 'cerebral/operators'
import {remove} from 'cerebral-provider-firebase'
import paths from '../paths'

export default function (moduleName) {
  const {dynamicPaths} = paths(moduleName)
  return [
    ...dynamicPaths,
    remove(input`remoteItemPath`), {
      success: [],
      error: []
    }
  ]
}
