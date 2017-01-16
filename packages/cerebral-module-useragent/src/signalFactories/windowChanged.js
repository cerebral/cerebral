import {merge, state, input} from 'cerebral/operators'

export default (path) => {
  return [
    merge(state`${path}.media`, input`media`),
    merge(state`${path}.window`, input`windowSpec`)
  ]
}
