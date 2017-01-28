import {set} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'

export default (path) => {
  return [
    set(state`${path}.network.offline`, input`offline`)
  ]
}
