import {set, state, input} from 'cerebral/operators'

export default (path) => {
  return [
    set(state`${path.join('.')}.media`, input`media`),
    set(state`${path.join('.')}.window`, input`windowSpec`)
  ]
}
