import {v4} from 'uuid'

export default function (context) {
  return {ref: v4()}
}
