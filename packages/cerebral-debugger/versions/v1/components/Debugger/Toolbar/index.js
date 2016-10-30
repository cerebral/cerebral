import React from 'react';
import classNames from 'classnames';
import {connect} from 'cerebral-view-react';
import styles from './styles.css';
import icons from 'common/icons.css';
import signalsList from 'common/computed/signalsList';

@connect({
  currentPage: 'debugger.currentPage',
  isExecuting: 'debugger.isExecuting',
  appSignals: signalsList()
})
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedSignals: null
    };
  }
  render() {
    return (
      <ul className={styles.toolbar}>
        <li className={styles.item}>
          <ul className={styles.tabs}>
            <li
              className={classNames(styles.tab, {[styles.activeTab]: this.props.currentPage === 'signals'})}
              onClick={() => this.props.signals.debugger.pageChanged({page: 'signals'})}>
              <i className={icons.signals}/> CONTROLLER
            </li>
            <li
              className={classNames(styles.tab, {[styles.activeTab]: this.props.currentPage === 'components'})}
              onClick={() => this.props.signals.debugger.pageChanged({page: 'components'})}>
              <i className={icons.components}/> VIEW
            </li>
            <li
              className={classNames(styles.tabOnSmall, styles.tab, {[styles.activeTab]: this.props.currentPage === 'model'})}
              onClick={() => this.props.signals.debugger.pageChanged({page: 'model'})}>
              <i className={icons.model}/> MODEL
            </li>
            <li className={styles.rightItem}>
              {this.props.isExecuting ? 'executing' : 'idle'}
              <div className={classNames({
                [styles.idle]: !this.props.isExecuting,
                [styles.executing]: this.props.isExecuting
              })}></div>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}

 export default Toolbar
