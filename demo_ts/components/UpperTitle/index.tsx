import * as React from 'react'
import {connect} from 'cerebral/react'
import upperCaseTitleComputed from '../../upperCaseTitle'

interface Props {
  title?: string
}

export default connect<Props>({
  title: upperCaseTitleComputed()
},
  function UpperTitle(props) {
    return (
      <h4>{props.title}</h4>
    )
  }
)
