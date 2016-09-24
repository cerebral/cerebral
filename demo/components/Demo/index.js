import React from 'react'
import {connect} from 'cerebral/react'
import upperCaseTitle from '../../upperCaseTitle'

export default connect({
  title: 'title',
  upperTitle: upperCaseTitle()
}, {
  homeRouted: 'routed',
  adminRouted: 'admin.routed',
},
  function Demo(props) {
    return (
      <div>
        <h1>{props.title}</h1>
        <h4>{props.upperTitle}</h4>
        <a href={props.homeRouted.toUrl()}>Home</a>
        <a href={props.adminRouted.toUrl()}>Admin</a>
      </div>
    )
  }
)
