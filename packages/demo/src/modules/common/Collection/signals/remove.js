import {input} from 'cerebral/operators'
import {remove} from 'cerebral-provider-firebase'
import {setPaths} from '../paths'

export default function (moduleName) {
  return [
    ...setPaths(moduleName),
    remove(input`remoteItemPath`), {
      success: [],
      error: []
    }
  ]
}
