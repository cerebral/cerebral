import {state, when} from 'cerebral/operators'
import editClient from './editClient'

const outputRef = ({path, state}) => {
  const ref = state.get('clients.$nextEditRef')
  state.unset('clients.$nextEditRef')
  return {ref}
}

export default [
  when(state`clients.$nextEditRef`), {
    true: [outputRef, ...editClient],
    false: []
  }
]
