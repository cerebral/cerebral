import './styles.css'
import React from 'react'
import {connect} from 'cerebral/react'

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
        <div className='debugger'>
          <div className='debugger-toolbar'>
            <Toolbar />
          </div>
          <div className='debugger-disabled'>
            <img src='logo.png' width='200' role='presentation'/>
            <h1>Disabled</h1>
            <h3>Enable debugger and refresh</h3>
          </div>
        </div>
      )
    }
    const mutationsError = props.mutationsError

    return (
      <div className='debugger'>
        {
           mutationsError ?
             <div className='debugger-mutationsError'>
               <h1>Ops!</h1>
               <h4>Signal "{mutationsError.signalName}" causes an error doing <strong>{mutationsError.mutation.name}</strong>("{mutationsError.mutation.path.join('.')}", {JSON.stringify(mutationsError.mutation.args).replace(/^\[/, '').replace(/\]$/, '')})</h4>
             </div>
          :
            <div className='debugger-toolbar'>
              <Toolbar />
            </div>
        }
        <div className='debugger-content'>
          {
            props.currentPage === 'signals' ?
              <Signals className={props.currentPage !== 'signals' ? 'debugger-hiddenOnSmall' : null} />
            :
              null
          }
          {
            props.currentPage === 'components' ?
              <Components className={props.currentPage !== 'components' ? 'debugger-hiddenOnSmall' : null} />
            :
              null
          }
          {
            props.currentPage !== 'components' ?
              <Model className={props.currentPage !== 'model' ? 'debugger-hiddenOnSmall' : null} />
            :
              null
          }

        </div>
      </div>
    )
  }
)
