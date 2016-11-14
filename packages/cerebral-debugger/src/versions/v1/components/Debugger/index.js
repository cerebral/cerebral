import React from 'react'
import {connect} from 'cerebral/react'
import styles from './styles.css'

import Toolbar from './Toolbar'
import Signals from './Signals'
import Components from './Components'
import Model from './Model'

export default connect({
  currentPage: 'debugger.currentPage',
  settings: 'debugger.settings',
  mutationsError: 'debugger.mutationsError'
},
  function Debugger (props) {
    if (props.settings.disableDebugger) {
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
    const mutationsError = props.mutationsError;

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
            props.currentPage === 'signals' ?
              <Signals className={props.currentPage !== 'signals' ? styles.hiddenOnSmall : null}/>
            :
              null
          }
          {
            props.currentPage === 'components' ?
              <Components className={props.currentPage !== 'components' ? styles.hiddenOnSmall : null}/>
            :
              null
          }
          {
            props.currentPage !== 'components' ?
              <Model className={props.currentPage !== 'model' ? styles.hiddenOnSmall : null}/>
            :
              null
          }

        </div>
      </div>
    )
  }
)
