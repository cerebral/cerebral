import React from 'react'
import { connect } from 'cerebral/react'

export default connect({
  messages: 'toast.messages'
}, {
}, function Toast (props) {
  let toast = null
  if (props.messages.length > 0) {
    toast = <div className='c-alerts c-alerts--bottomright'>
      { props.messages.slice(0, 3).map((toast, i) => {
        return ToastItem(
                    toast,
                    i
                  )
      }) }
    </div>
  }
  return (toast)
}
)
const ToastItem = (toast, toastId) => (
  <div
    key={toastId}
    className='c-alert'>
    { toast }
  </div>
)

