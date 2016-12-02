import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../common/computed/translations'

export default connect(
  {
    t: translations,
    error: 'app.$error'
  },
  {
    dismiss: 'app.dismissNotificationClicked'
  },
  function Notification ({t, error, dismiss}) {
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
