import {state, unset} from 'cerebral/operators'
import editNextRef from './editNextRef'

export default [
  unset(state`clients.$showSaveDraftModal`),
  unset(state`clients.$draft`),
  ...editNextRef
]
