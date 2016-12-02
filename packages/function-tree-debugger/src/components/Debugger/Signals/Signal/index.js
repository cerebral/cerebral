/* global Prism */
import './styles.css'
import React from 'react'
import {connect} from 'cerebral/react'
import connector from 'connector'

import Action from './Action'

export default connect(props => ({
  currentPage: 'debugger.currentPage',
  useragent: 'useragent.**',
  signal: `debugger.signals.${props.currentSignalExecutionId}.**`
}), {
  mutationClicked: 'debugger.mutationClicked'
},
  class Signal extends React.Component {
    constructor (props) {
      super(props)
      this.renderAction = this.renderAction.bind(this)
      this.onMutationClick = this.onMutationClick.bind(this)
      this.onActionClick = this.onActionClick.bind(this)
    }
    shouldComponentUpdate (nextProps) {
      return nextProps.currentPage === 'signals' || !nextProps.useragent.media.small
    }
    onMutationClick (path) {
      this.props.mutationClicked({
        path
      })
    }
    onActionClick (action) {
      connector.inspect(this.props.signal.name, action.actionIndex)
    }
    componentDidMount () {
      Prism.highlightAll()
    }
    componentDidUpdate () {
      Prism.highlightAll()
    }
    renderOutputs (action) {
      return Object.keys(action.outputs).map((output, index) => {
        const isOutput = (
          this.props.signal.functionsRun[action.functionIndex] &&
          this.props.signal.functionsRun[action.functionIndex].path === output
        )
        const style = isOutput ? null : {opacity: 0.3}

        return (
          <div className='signal-output' style={style} key={index}>
            {isOutput ? <i className='icon icon-right' /> : <i className='icon icon-empty' />}
            <div className='signal-outputPath'>
              <div className='signal-outputName'>{output}</div>
              {action.outputs[output].map(this.renderAction)}
            </div>
          </div>
        )
      })
    }
    renderAction (action, index) {
      if (Array.isArray(action)) {
        return (
          <div className='signal-asyncHeader' key={index}>
            <div className='signal-async'>
              {action.map(this.renderAction)}
            </div>
          </div>
        )
      }

      return (
        <Action
          action={action}
          execution={this.props.signal.functionsRun[action.functionIndex]}
          key={index}
          onMutationClick={this.onMutationClick}
          onActionClick={this.onActionClick}>
          {action.outputs ? this.renderOutputs(action) : null}
        </Action>
      )
    }
    render () {
      if (!this.props.signal) {
        return <span>No signal yet...</span>
      }

      return (
        <div className='signal'>
          <h3 className='signal-title'>{this.props.signal.name}</h3>
          <div className='signal-chain'>
            {this.props.signal.staticTree.map((action, index) => this.renderAction(action, index))}
          </div>
        </div>
      )
    }
  }
)
