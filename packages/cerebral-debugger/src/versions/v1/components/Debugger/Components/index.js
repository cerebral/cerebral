import React from 'react'
import {connect} from 'cerebral/react'
import styles from './styles.css'
import connector from 'connector'

import StatePaths from './StatePaths'
import Renders from './Renders'

export default connect({
  map: 'debugger.componentsMap',
  renders: 'debugger.renders'
},
  function Components (props) {
    return (
      <div className={styles.wrapper}>
        <StatePaths map={props.map} />
        <Renders renders={props.renders} />
      </div>
    )
  }
)
