import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import Menu from '../Menu'
import PrettyPrint from '../PrettyPrint'
import CurrentView from '../CurrentView'

export default connect({
  currentView: state`app.currentView`
},
  function App ({currentView}) {
    return (
      <div>
        <Menu />
        <CurrentView />
        <PrettyPrint currentView={currentView.toLowerCase()} />
      </div>
    )
  }
)
