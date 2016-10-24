import React from 'react'
import { connect } from 'cerebral/react'

export default connect({
  title: 'title'
}, {
}, function HeaderButton (props) {
  return (
    <div>
      <button className='c-button c-button--info c-button--block'>
        { props.title }
      </button>
    </div>
  )
}
)
