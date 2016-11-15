import './styles.css'
import React from 'react'
import classNames from 'classnames'
import {connect} from 'cerebral/react'
import signalsList from '../../../../../common/computed/signalsList'

import List from './List'
import Signal from './Signal'

const connector = process.env.NODE_ENV === 'production'
  ? require('../../../../../connector/extension').default
  : require('../../../../../connector/simulated').default

export default connect({
  currentPage: 'debugger.currentPage',
  signalsList: signalsList,
  useragent: 'useragent.**',
  currentSignalExecutionId: 'debugger.currentSignalExecutionId',
  isExecuting: 'debugger.isExecuting'
}, {
  resetClicked: 'debugger.resetClicked'
},
  class Signals extends React.Component {
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
        <div className={classNames('signals', this.props.className)}>
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
            <Signal currentSignalExecutionId={currentSignalExecutionId}/>
          </div>
          {
            this.state.copiedSignals ?
              <li className='signals-textarea'>
                <textarea ref={(node) => this.textarea = node} value={this.state.copiedSignals} onBlur={() => this.setState({copiedSignals: null})} />
              </li>
            :
              null
          }
        </div>
      )
    }
  }
)
