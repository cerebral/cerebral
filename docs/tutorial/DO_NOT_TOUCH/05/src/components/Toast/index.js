import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  message: state`toast`
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
