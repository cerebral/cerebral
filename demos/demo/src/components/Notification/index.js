import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

export default connect(
  {
    dismiss: signal`app.dismissNotificationClicked`,
    error: state`app.$error`,
    t: translations
  },
  function Notification ({dismiss, error, t}) {
    if (error) {
      return (
        <div className='notification is-warning'>
          <button className='delete'
            onClick={() => dismiss()} />
          {error}
        </div>
      )
    } else {
      return null
    }
  }
)
