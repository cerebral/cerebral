import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default (path) => {
  return [
    set(state`${path}.network.offline`, props`offline`)
  ]
}
