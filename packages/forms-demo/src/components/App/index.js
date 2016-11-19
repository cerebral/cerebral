import React from 'react'
import {connect} from 'cerebral/react'
import Menu from '../Menu'
import PrettyPrint from '../PrettyPrint'
import CurrentView from '../CurrentView'

export default connect(
  {
    currentView: 'app.currentView'
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
