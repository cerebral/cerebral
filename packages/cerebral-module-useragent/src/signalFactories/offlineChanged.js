import {set, state, input} from 'cerebral/operators'

export default (path) => {
  return [
    set(state`${path.join('.')}.network.offline`, input`offline`)
  ]
}
