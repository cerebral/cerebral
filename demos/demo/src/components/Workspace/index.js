import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

import Clients from '../Clients'
import Projects from '../Projects'
import Tasks from '../Tasks'
import Today from '../Today'

const VIEWS = {
  clients: Clients,
  projects: Projects,
  tasks: Tasks,
  today: Today
}

export default connect(
  {
    selectedView: state`app.$selectedView`
  },
  function Workspace ({selectedView}) {
    const CurrentView = VIEWS[selectedView] || Today
    return (
      <div className='section'>
        <CurrentView />
      </div>
    )
  }
)
