import React from 'react'
import { connect } from '@cerebral/react'
import translations from '../../common/compute/translations'
import { displayDate } from '../../helpers/dateTime'

export default connect(
  {
    t: translations,
  },
  function Date({ date, t }) {
    return <span>{displayDate(date, t)}</span>
  }
)
