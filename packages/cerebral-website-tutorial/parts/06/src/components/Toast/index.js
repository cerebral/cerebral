import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  message: 'toast'
},
  function Toast (props) {
    if (!props.message) {
      return null
    }

    return (
      <div className='c-alerts c-alerts--bottomright'>
        <div className='c-alert'>
          {props.message}
        </div>
      </div>
    )
  }
)
