import {merge} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default (path) => {
  return [
    merge(state`${path}.media`, props`media`),
    merge(state`${path}.window`, props`windowSpec`)
  ]
}
