/* global Prism */
import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import connector from 'connector'

import Action from './Action'

export default connect({
  currentPage: state`debugger.currentPage`,
  useragent: state`useragent`,
  signal: state`debugger.signals.${state`debugger.currentSignalExecutionId`}`,
  searchValue: state`debugger.searchValue`,
  mutationClicked: signal`debugger.mutationClicked`
},
  class Signal extends Inferno.Component {
    constructor (props) {
      super()
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
        const outputs = action.outputs[output]._functionTreePrimitive ? action.outputs[output].items : action.outputs[output]

        return (
          <div className='signal-output' style={style} key={index}>
            {isOutput || isExpanded ? (
              <i className={`icon icon-down ${isOutput ? '' : 'clickable'}`} onClick={(event) => this.toggleOutput(event, action, output)} />
            ) : (
              <i className={`icon icon-right ${isOutput ? '' : 'clickable'}`} onClick={(event) => this.toggleOutput(event, action, output)} />
            )}
            <div className='signal-outputPath' onClick={(event) => this.toggleOutput(event, action, output)}>
              <div className={isOutput ? 'signal-outputName executed' : 'signal-outputName'}>{output}</div>
              {isOutput || isExpanded ? outputs.map(this.renderAction) : null}
            </div>
          </div>
        )
      })
    }
    actionHasSearchContent (action) {
      const data = this.props.signal.functionsRun[action.functionIndex] ? this.props.signal.functionsRun[action.functionIndex].data : null

      return (data || []).reduce((currentHasSearchContent, dataItem) => {
        if (currentHasSearchContent) {
          return currentHasSearchContent
        }

        if (dataItem.type === 'mutation' && dataItem.args[0].join('.').indexOf(this.props.searchValue) >= 0) {
          return true
        }

        return false
      }, false)
    }
    renderAction (action, index) {
      if (action._functionTreePrimitive) {
        return (
          <div key={index}>
            <span className='signal-groupName'><strong>{action.type}</strong>{action.name ? ': ' + action.name : null}</span>
            <div className='signal-groupHeader' key={index}>
              <div className='signal-group'>
                {action.items.map(this.renderAction)}
              </div>
            </div>
          </div>
        )
      }

      const hasSearchContent = (
        this.props.searchValue &&
        this.actionHasSearchContent(action)
      )

      return (
        <Action
          action={action}
          faded={hasSearchContent === false}
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
            {this.props.signal.staticTree.items.map((action, index) => this.renderAction(action, index))}
          </div>
        </div>
      )
    }
  }
)
