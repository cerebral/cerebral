import React from 'react';
import {connect} from 'cerebral-view-react';
import styles from './styles.css';

import Toolbar from './Toolbar';
import Signals from './Signals';
import Components from './Components';
import Model from './Model';

@connect({
  currentPage: 'debugger.currentPage',
  settings: 'debugger.settings',
  mutationsError: 'debugger.mutationsError'
})
class Debugger extends React.Component {
  render() {
    if (this.props.settings.disableDebugger) {
      return (
        <div className={styles.debugger}>
          <div className={styles.toolbar}>
            <Toolbar />
          </div>
          <div className={styles.disabled}>
            <img src="logo.png" width="200"/>
            <h1>Disabled</h1>
            <h3>Enable debugger and refresh</h3>
          </div>
        </div>
      );
    }
    const mutationsError = this.props.mutationsError;

    return (
      <div className={styles.debugger}>
         {
           mutationsError ?
             <div className={styles.mutationsError}>
               <h1>Ops!</h1>
               <h4>Signal "{mutationsError.signalName}" causes an error doing <strong>{mutationsError.mutation.name}</strong>("{mutationsError.mutation.path.join('.')}", {JSON.stringify(mutationsError.mutation.args).replace(/^\[/, '').replace(/\]$/, '')})</h4>
             </div>
          :
            <div className={styles.toolbar}>
              <Toolbar />
            </div>
        }
        <div className={styles.content}>
          {
            this.props.currentPage === 'signals' ?
              <Signals className={this.props.currentPage !== 'signals' ? styles.hiddenOnSmall : null}/>
            :
              null
          }
          {
            this.props.currentPage === 'components' ?
              <Components className={this.props.currentPage !== 'components' ? styles.hiddenOnSmall : null}/>
            :
              null
          }
          {
            this.props.currentPage !== 'components' ?
              <Model className={this.props.currentPage !== 'model' ? styles.hiddenOnSmall : null}/>
            :
              null
          }

        </div>
      </div>
    );
  }
}

 export default Debugger
