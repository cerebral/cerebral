import React from 'react'
import { connect } from 'cerebral/react'

export default connect({
  title: 'sas.title'
}, {
  buttonClicked: 'sas.buttonClicked'
}, function HeaderButton (props) {
  return (
    <div>
      <button
        onClick={() => props.buttonClicked()}
        className='c-button c-button--info c-button--block'>
        { props.title }
      </button>
    </div>
  )
}
)
