import React from 'react'
import {connect} from 'cerebral/react'
import {signal} from 'cerebral/tags'

export default connect(
  {
    onClick: signal`clients.phoneClicked`
  },
  function Phone ({onClick, phone}) {
    return <a className='level-item'
      onClick={phone ? () => onClick({phone}) : null}>
      <span className='icon is-small'><i className='fa fa-phone' style={phone ? null : {color: '#ccc'}} /></span>
    </a>
  }
)
