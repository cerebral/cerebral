import {input, set, state} from 'cerebral/operators'
import updateNow from './updateNow'
import now from '../../common/operators/now'

export default [
  set(input`startedAt`, now),
  set(state`tasks.$now`, input`startedAt`),
  set(state`tasks.$running.startedAt`, input`startedAt`),
  ...updateNow
]
