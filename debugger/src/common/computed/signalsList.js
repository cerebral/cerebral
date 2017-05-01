import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`debugger.signals`,
  (signals) => {
    return Object.keys(signals)
      .sort((keyA, keyB) => {
        if (signals[keyA].datetime > signals[keyB].datetime) {
          return -1
        } else if (signals[keyA].datetime < signals[keyB].datetime) {
          return 1
        }

        return 0
      })
      .map(key => signals[key])
  }
)
