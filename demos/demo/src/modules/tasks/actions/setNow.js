import {now} from '../../../helpers/dateTime'

export default function setNow (strings, ...values) {
  return {now: now()}
}
