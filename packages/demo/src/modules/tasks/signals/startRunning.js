import {input, set, state} from 'cerebral/operators'
import updateNow from './updateNow'
import {now} from '../../../helpers/dateTime'

export default [
  set(input`startedAt`, () => ({value: now()})),
  set(state`tasks.$now`, input`startedAt`),
  set(state`tasks.$running.startedAt`, input`startedAt`),
  ...updateNow
]
