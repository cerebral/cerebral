import React from 'react'
import { connect } from 'cerebral/react'
import { getStars } from '../../computeds/getStars'
export default connect({
  total: getStars
}, {
  buttonClicked: 'github.starCountClicked'
}, function StarCountButton (props) {
  return (
    <button onClick={() => props.buttonClicked()} className='c-button c-button--brand c-button--block'>
      Get Total Stars for Cerebral and Cerebral - Debugger ({props.total})
    </button>
  )
}
)
