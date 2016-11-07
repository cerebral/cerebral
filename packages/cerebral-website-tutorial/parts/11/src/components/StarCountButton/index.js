import React from 'react'
import { connect } from 'cerebral/react'

export default connect({
}, {
  buttonClicked: 'starCountClicked'
}, function StarCountButton (props) {
  return (
    <div>
      <button onClick={() => props.buttonClicked()} className='c-button c-button--brand c-button--block'>
        Get Total Stars for Cerebral and Cerebral-Debugger
      </button>
    </div>
  )
}
)
