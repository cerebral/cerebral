import './styles.css'
import React from 'react'
import {connect} from 'cerebral/react'

import StatePaths from './StatePaths'
import Renders from './Renders'

export default connect({
  map: 'debugger.componentsMap.**',
  renders: 'debugger.renders.**'
},
  function Components (props) {
    return (
      <div className='components-wrapper'>
        <StatePaths map={props.map} />
        <Renders renders={props.renders} />
      </div>
    )
  }
)
