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
      this.state = {expandedOutputs: {}}
    }
    shouldComponentUpdate (nextProps, nextState) {
      return (
        nextProps.currentPage === 'signals' ||
        !nextProps.useragent.media.small ||
        this.state.expandedOutputs !== nextState.expandedOutputs
      )
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
    toggleOutput (event, action, output) {
      const expandedOutputs = Object.assign({}, this.state.expandedOutputs)

      event.stopPropagation()

      if (!expandedOutputs[action.functionIndex]) {
        expandedOutputs[action.functionIndex] = {}
      }

      if (expandedOutputs[action.functionIndex][output]) {
        delete expandedOutputs[action.functionIndex][output]
      } else {
        expandedOutputs[action.functionIndex][output] = true
      }

      this.setState({expandedOutputs})
    }
    renderOutputs (action) {
      return Object.keys(action.outputs).map((output, index) => {
        const isOutput = (
          this.props.signal.functionsRun[action.functionIndex] &&
          this.props.signal.functionsRun[action.functionIndex].path === output
        )
        const style = isOutput ? null : {opacity: 0.3}
        const isExpanded = this.state.expandedOutputs[action.functionIndex] && this.state.expandedOutputs[action.functionIndex][output]

        return (
          <div className='signal-output' style={style} key={index}>
            {isOutput || isExpanded ? (
              <i className={`icon icon-down ${isOutput ? '' : 'clickable'}`} onClick={(event) => this.toggleOutput(event, action, output)} />
            ) : (
              <i className={`icon icon-right ${isOutput ? '' : 'clickable'}`} onClick={(event) => this.toggleOutput(event, action, output)} />
            )}
            <div className='signal-outputPath' onClick={(event) => this.toggleOutput(event, action, output)}>
              <div className={isOutput ? 'signal-outputName executed' : 'signal-outputName'}>{output}</div>
              {isOutput || isExpanded ? action.outputs[output].map(this.renderAction) : null}
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
