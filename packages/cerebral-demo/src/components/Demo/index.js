/* eslint-disable no-script-url */
import React from 'react'
import {connect} from 'cerebral/react'
import UpperTitle from '../UpperTitle'

export default connect({
  title: 'title'
}, {
  frontRouted: 'routed',
  adminRouted: 'admin.routed'
},
  function Demo (props) {
    const onAdminClicked = () => {
      props.adminRouted()
    }

    const onFrontClicked = () => {
      props.frontRouted()
    }

    return (
      <div>
        <h1>{props.title}</h1>
        <UpperTitle />
        <a href='javascript:;' onClick={onFrontClicked}>Front</a>
        <a href='javascript:;' onClick={onAdminClicked}>Admin</a>
      </div>
    )
  }
)
