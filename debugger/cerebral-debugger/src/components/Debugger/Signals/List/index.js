import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import {nameToColors} from '../../../../common/utils'
import classnames from 'classnames'
import signalsList from '../../../../common/computed/signalsList'
import connector from 'connector'

export default connect({
  debugger: state`debugger`,
  signalsList: signalsList,
  isExecuting: state`debugger.isExecuting`,
  searchValue: state`debugger.searchValue`,
  signalClicked: signal`debugger.signalClicked`,
  signalDoubleClicked: signal`debugger.signalDoubleClicked`
},
  class SignalsList extends Inferno.Component {
    onSignalClick (event, signal, index) {
      this.props.signalClicked({
        executionId: signal.executionId,
        groupId: signal.groupId
      })
    }
    onSignalDoubleClick (signal) {
      if (this.props.debugger.isExecuting) {
        return
      }
      this.props.signalDoubleClicked({
        executionId: signal.executionId
      })
      connector.sendEvent('remember', signal.executionId)
    }
    hasSearchContent (signal) {
      return Object.keys(signal.functionsRun).reduce((hasSearchContent, key) => {
        const data = signal.functionsRun[key].data

        if (hasSearchContent) {
          return hasSearchContent
        }

        return (data || []).reduce((currentHasSearchContent, dataItem) => {
          if (currentHasSearchContent) {
            return currentHasSearchContent
          }

          if (dataItem.type === 'mutation' && dataItem.args[0].join('.').indexOf(this.props.searchValue) >= 0) {
            return true
          }

          return false
        }, hasSearchContent)
      }, false)
    }
    renderSignal (signal, index) {
      const prevSignal = this.props.signalsList[index - 1]
      const currentSignalExecutionId = this.props.debugger.currentSignalExecutionId
      const namePath = signal.name.split('.')
      const name = namePath.pop()
      const colors = nameToColors(signal.name, name)
      const hex = colors.backgroundColor
      const signalStyle = {
        backgroundColor: hex
      }
      const isActive = currentSignalExecutionId === signal.executionId
      const hasSearchContent = (
        this.props.searchValue &&
        this.hasSearchContent(signal)
      )

      const className = classnames({
        'list-item': true,
        'list-activeItem': isActive,
        'list-grouped': signal.isGrouped,
        pulse: signal.isExecuting
      })
      const indicatorClassname = classnames('list-indicator', {
        'list-fadedItem': hasSearchContent === false
      })
      const isInOpenGroup = this.props.debugger.expandedSignalGroups.indexOf(signal.groupId) !== -1

      if (
        prevSignal &&
        prevSignal.groupId === signal.groupId &&
        !isInOpenGroup
      ) {
        return null
      }

      let groupCount = 1
      for (let x = index + 1; x < this.props.signalsList.length - 1; x++) {
        if (this.props.signalsList[x].groupId === signal.groupId) {
          groupCount++
        } else {
          break
        }
      }

      return (
        <li
          onClick={(event) => this.onSignalClick(event, signal, index)}
          onDoubleClick={() => this.onSignalDoubleClick(signal, index)}
          className={className}
          key={index}>
          {signal.executionId === this.props.debugger.currentRememberedSignalExecutionId ? <div className='list-remembered' /> : null}
          {isInOpenGroup && prevSignal && prevSignal.groupId === signal.groupId ? null : <div className={indicatorClassname} style={signalStyle} />}
          <span className='list-name'>{name} <small>{!prevSignal && groupCount > 1 ? ` (${groupCount})` : null}</small></span>
        </li>
      )
    }
    render () {
      const signals = this.props.signalsList

      return (
        <ul className='list'>
          {signals.map((signal, index) => this.renderSignal(signal, index))}
        </ul>
      )
    }
  }
)
