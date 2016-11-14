import {Computed} from 'cerebral'

export default Computed({
  signals: 'debugger.signals',
  currentSignalExecutionId: 'debugger.currentSignalExecutionId'
}, ({currentSignalExecutionId, signals}) => {
  return signals[currentSignalExecutionId]
})
