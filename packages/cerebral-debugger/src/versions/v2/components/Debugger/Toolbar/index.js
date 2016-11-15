import './styles.css'
import React from 'react'
import classNames from 'classnames'
import {connect} from 'cerebral/react'
import signalsList from '../../../../../common/computed/signalsList'

export default connect({
  currentPage: 'debugger.currentPage',
  executingSignalsCount: 'debugger.executingSignalsCount',
  appSignals: signalsList
}, {
  pageChanged: 'debugger.pageChanged'
},
  class Toolbar extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        copiedSignals: null
      }
    }
    render () {
      return (
        <ul className='toolbar'>
          <li className='toolbar-item'>
            <ul className='toolbar-tabs'>
              <li
                className={classNames('toolbar-tab', {'toolbar-tab--active': this.props.currentPage === 'signals'})}
                onClick={() => this.props.pageChanged({page: 'signals'})}>
                <i className='icon icon-signals' /> CONTROLLER
              </li>
              <li
                className={classNames('toolbar-tab', {'toolbar-tab--active': this.props.currentPage === 'components'})}
                onClick={() => this.props.pageChanged({page: 'components'})}>
                <i className='icon icon-components' /> COMPONENTS
              </li>
              <li
                className={classNames('toolbar-tabOnSmall', 'toolbar-tab', {'toolbar-tab--active': this.props.currentPage === 'model'})}
                onClick={() => this.props.pageChanged({page: 'model'})}>
                <i className='icon icon-model' /> STATE-TREE
              </li>
              <li className='toolbar-rightItem'>
                {Boolean(this.props.executingSignalsCount) ? 'executing' : 'idle'}
                <div className={classNames('toolbar-led', {
                  'toolbar-led--idle': !Boolean(this.props.executingSignalsCount),
                  'toolbar-led--executing': Boolean(this.props.executingSignalsCount)
                })} />
              </li>
            </ul>
          </li>
        </ul>
      )
    }
  }
)
