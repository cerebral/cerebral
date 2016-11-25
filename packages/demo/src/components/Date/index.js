import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../common/computed/translations'
import {displayDate} from '../../helpers/dateTime'

export default connect(
  {
    t: translations
  },
  function Date ({date, t}) {
    return <span>{displayDate(date, t)}</span>
  }
)
