import {merge, state, input} from 'cerebral/operators'

export default (path) => {
  return [
    merge(state`${path.join('.')}.media`, input`media`),
    merge(state`${path.join('.')}.window`, input`windowSpec`)
  ]
}
