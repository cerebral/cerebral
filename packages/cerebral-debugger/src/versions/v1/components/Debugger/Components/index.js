import React from 'react'
import {connect} from 'cerebral/react'
import styles from './styles.css'

import StatePaths from './StatePaths'
import Renders from './Renders'

const connector = process.env.NODE_ENV === 'production'
  ? require('../../../../../connector/extension')
  : require('../../../../../connector/simulated')

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
