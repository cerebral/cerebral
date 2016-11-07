import React from 'react'
import { connect } from 'cerebral/react'

const ToastItem = (toast) => {
  let type = ''
  if (toast.type) {
    if (toast.type === 'success') {
      type = '--success'
    } else {
      type = '--error'
    }
  }
  return (
    <div
      key={toast.id}
      style={{ marginsTop: 5, marginBottom: 5 }}
      className={'c-alert' + type + ' u-window-box--xsmall  fadein'}>
      { toast.msg }
    </div>)
}

export default connect({
  messages: 'toast.messages'
}, {
}, function Toast (props) {
  let toast = null
  if (props.messages.length > 0) {
    toast = <div className='c-alerts c-alerts--bottomright'>
      { props.messages.slice(0, 6).map((toast) => {
        return ToastItem(
                    toast
                  )
      }) }
    </div>
  }
  return (toast)
}
)

