import * as React from 'react'
import {connect} from 'cerebral/react'
import UpperTitle from '../UpperTitle'

interface Props {
  title?: string,
  frontRouted?: any,
  adminRouted?: any
}

export default connect<Props>({
  title: 'title'
}, {
  frontRouted: 'routed',
  adminRouted: 'admin.routed'
},
  function Demo(props) {

    const onAdminClicked = () => {
      props.adminRouted();
    }

    const onFrontClicked = () => {
      props.frontRouted();
    }

    return (
      <div>
        <h1>{props.title}</h1>
        <UpperTitle />
        <a href="javascript:;" onClick={onFrontClicked}>Front</a>
        <a href="javascript:;" onClick={onAdminClicked}>Admin</a>
      </div>
    )
  }
)
