import React from 'react'
import classNames from 'classnames'
import {connect} from 'cerebral-view-react'
import styles from './styles.css'
import connector from 'connector'
import signalsList from 'common/computed/signalsList'

import List from './List'
import Signal from './Signal'

export default connect({
  currentPage: 'debugger.currentPage',
  signalsList: signalsList(),
  media: 'useragent.media',
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
        this.props.media.small !== nextProps.media.small ||
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
        <div className={classNames(styles.signals, this.props.className)}>
          <div className={styles.list}>
            <List />
            <button
              onClick={() => this.onCopySignalsClick()}
              className={styles.rewrite}
              disabled={!currentSignalExecutionId}>
              Copy signals data
            </button>
            <button
              onClick={() => this.onResetClick()}
              className={styles.reset}
              disabled={!currentSignalExecutionId || this.props.isExecuting}>
              Reset all state
            </button>
          </div>
          <div className={styles.signal}>
            <Signal />
          </div>
          {
            this.state.copiedSignals ?
              <li className={styles.textarea}>
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
