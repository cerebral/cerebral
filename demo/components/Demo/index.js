import React from 'react'
import {connect} from 'cerebral/react'
import UpperTitle from '../UpperTitle'

export default connect({
  title: 'title'
}, {
  frontRouted: 'routed',
  adminRouted: 'admin.routed'
},
  function Demo(props) {
    return (
      <div>
        <h1>{props.title}</h1>
        <UpperTitle />
        <a href={props.frontRouted.toUrl()}>Front</a>
        <a href={props.adminRouted.toUrl()}>Admin</a>
      </div>
    )
  }
)
