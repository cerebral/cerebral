import React from 'react'
import {connect} from 'cerebral/react'

import Clients from '../Clients'
import Projects from '../Projects'
import Tasks from '../Tasks'
import Today from '../Today'

const VIEWS = {
  Clients,
  Projects,
  Tasks,
  Today
}

export default connect({
  'selectedView': 'app.$selectedView'
},
function Workspace ({selectedView}) {
  const CurrentView = VIEWS[selectedView]
  return (
    <div className='section'>
      <CurrentView />
    </div>
  )
})
