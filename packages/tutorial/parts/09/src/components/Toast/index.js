import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  toast: 'toast'
},
  function Toast (props) {
    if (!props.toast) {
      return null
    }

    return (
      <div className='c-alerts c-alerts--bottomright'>
        <div className={`c-alert ${props.toast.type ? 'c-alert--' + props.toast.type : ''}`}>
          {props.toast.message}
        </div>
      </div>
    )
  }
)
