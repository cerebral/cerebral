import {connect} from 'cerebral/react'
import {displayElapsed, elapsedSeconds} from '../../helpers/dateTime'

export default connect(
  {
    now: 'tasks.$now'
  },
  function RunningElapsed ({startedAt, now}) {
    console.log('RunningElapsed')
    return displayElapsed(elapsedSeconds(startedAt, now))
  }
)
