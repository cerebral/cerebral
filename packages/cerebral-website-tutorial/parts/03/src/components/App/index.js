import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  title: 'title',
  subTitle: 'subTitle'
},
  function App (props) {
    return (
      <div className='o-container o-container--medium'>
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
      </div>
    )
  }
)
