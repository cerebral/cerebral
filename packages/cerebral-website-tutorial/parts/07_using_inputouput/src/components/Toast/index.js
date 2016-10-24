import React from 'react'
import { connect } from 'cerebral/react'

export default connect({
  message: 'toast.message'
}, {
}, function App (props) {
  let toast = null
  if (props.message) {
    toast = <div className='c-alerts c-alerts--bottomright'>
      <div className='c-alert'>
        { props.message }
      </div>
    </div>
  }
  return (toast)
}
)
