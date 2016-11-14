import {Computed} from 'cerebral'

export default Computed({
  signals: 'debugger.signals'
}, props => {
  const signals = props.signals

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
})
