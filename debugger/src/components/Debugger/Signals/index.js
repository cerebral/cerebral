import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import signalsList from '../../../common/computed/signalsList'
import connector from 'connector'

import List from './List'
import Signal from './Signal'

export default connect({
  currentPage: state`debugger.currentPage`,
  signalsList: signalsList,
  useragent: state`useragent`,
  currentSignalExecutionId: state`debugger.currentSignalExecutionId`,
  isExecuting: state`debugger.isExecuting`,
  resetClicked: signal`debugger.resetClicked`
},
  class Signals extends Inferno.Component {
    constructor (props) {
      super(props)
      this.state = {copiedSignals: null}
    }
    shouldComponentUpdate (nextProps, nextState) {
      return (
        this.props.currentPage !== nextProps.currentPage ||
        this.props.useragent.media.small !== nextProps.useragent.media.small ||
        this.props.currentSignalExecutionId !== nextProps.currentSignalExecutionId ||
        this.props.mutationsError !== nextProps.mutationsError ||
        this.state.copiedSignals !== nextState.copiedSignals ||
        this.props.isExecuting !== nextProps.isExecuting
      )
    }
    onResetClick () {
      this.props.resetClicked()
      connector.sendEvent('reset')
    }
    onCopySignalsClick () {
      this.setState({copiedSignals: JSON.stringify(this.props.signalsList.reverse(), null, 2)}, () => {
        this.textarea.select()
      })
    }
    render () {
      const currentSignalExecutionId = this.props.currentSignalExecutionId

      return (
        <div className='signals'>
          <div className='signals-list'>
            <List />
            <button
              onClick={() => this.onCopySignalsClick()}
              className='signals-rewrite'
              disabled={!currentSignalExecutionId}>
              Copy signals data
            </button>
            <button
              onClick={() => this.onResetClick()}
              className='signals-reset'
              disabled={!currentSignalExecutionId || this.props.isExecuting}>
              Reset all state
            </button>
          </div>
          <div className='signals-signal'>
            <Signal />
          </div>
          {
            this.state.copiedSignals
              ? <li className='signals-textarea'>
                <textarea ref={(node) => { this.textarea = node }} value={this.state.copiedSignals} onBlur={() => this.setState({copiedSignals: null})} />
              </li>
              : null
          }
        </div>
      )
    }
  }
)
