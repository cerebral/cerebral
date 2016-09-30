import React from 'react'
import {connect} from 'cerebral/react'
import upperCaseTitleComputed from '../../upperCaseTitle'

export default connect({
  title: upperCaseTitleComputed()
},
  function UpperTitle(props) {
    return (
      <h4>{props.title}</h4>
    )
  }
)
