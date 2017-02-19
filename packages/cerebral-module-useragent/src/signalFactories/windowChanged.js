import {merge} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'

export default (path) => {
  return [
    merge(state`${path}.media`, input`media`),
    merge(state`${path}.window`, input`windowSpec`)
  ]
}
