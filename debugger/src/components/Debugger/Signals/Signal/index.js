/* global Prism */
import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import connector from 'connector'
import classnames from 'classnames'

import Action from './Action'

export default connect({
  currentPage: state`debugger.currentPage`,
  useragent: state`useragent`,
  signal: state`debugger.signals.${state`debugger.currentSignalExecutionId`}`,
  executedBySignals: state`debugger.executedBySignals`,
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

      if (!(output in expandedOutputs[action.functionIndex])) {
        expandedOutputs[action.functionIndex][output] = true
      }

      if (expandedOutputs[action.functionIndex][output]) {
        expandedOutputs[action.functionIndex][output] = false
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
        const style = isOutput ? {cursor: 'pointer'} : {opacity: 0.3, fontSize: '8px'}
        let isExpanded = this.state.expandedOutputs[action.functionIndex] && this.state.expandedOutputs[action.functionIndex][output]
        isExpanded = typeof isExpanded === 'undefined' ? true : isExpanded
        const outputs = action.outputs[output]._functionTreePrimitive ? action.outputs[output].items : action.outputs[output]

        return (
          <div className='signal-output' style={style} key={index}>
            {isOutput && isExpanded ? (
              <i className='icon signal-outputIcon icon-down' onClick={(event) => this.toggleOutput(event, action, output)} />
            ) : (
              <i className='icon signal-outputIcon icon-right' onClick={(event) => this.toggleOutput(event, action, output)} />
            )}
            <div className='signal-outputPath' onClick={(event) => this.toggleOutput(event, action, output)}>
              <div className={isOutput ? 'signal-outputName executed' : 'signal-outputName'}>{output}</div>
              {isOutput && isExpanded ? outputs.map(this.renderAction) : null}
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

      const executedBySignal = (
        this.props.signal.functionsRun[action.functionIndex] && this.props.signal.functionsRun[action.functionIndex].executedId
      ) ? this.props.executedBySignals[this.props.signal.functionsRun[action.functionIndex].executedId] : null

      return (
        <Action
          action={action}
          faded={hasSearchContent === false}
          execution={this.props.signal.functionsRun[action.functionIndex]}
          key={index}
          onMutationClick={this.onMutationClick}
          onActionClick={this.onActionClick}
          executed={executedBySignal ? (
            <Signal
              className={classnames('executedBy', {
                'abort': executedBySignal.executedBy.isAbort
              })}
              style={{
                backgroundColor: '#FAFAFA'
              }}
              executedByColor='#EAEAEA'
              signal={executedBySignal}
              useragent={this.props.useragent}
              currentPage={this.props.currentPage}
              executedBySignals={this.props.executedBySignals}
              searchValue={this.props.searchValue}
              mutationClicked={() => {}}
            />
          ) : null}
        >
          {action.outputs ? this.renderOutputs(action) : null}
        </Action>
      )
    }
    render () {
      if (!this.props.signal) {
        return <span className='signal-empty'>No signals yet...</span>
      }

      return (
        <div className={classnames('signal', this.props.className)} style={this.props.style}>
          {this.props.executedByColor ? <div className='executedByLine' style={{backgroundColor: this.props.executedByColor}} /> : null}
          <h3 className='signal-title'>{this.props.signal.name}</h3>
          <div className='signal-chain'>
            {this.props.signal.staticTree.items.map((action, index) => this.renderAction(action, index))}
          </div>
          {this.props.executedByColor ? <div className='executedByLine' style={{backgroundColor: this.props.executedByColor}} /> : null}
        </div>
      )
    }
  }
)
