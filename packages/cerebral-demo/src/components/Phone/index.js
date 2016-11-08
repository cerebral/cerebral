import React from 'react'
import {connect} from 'cerebral/react'

export default connect(
  null,
  {
    onClick: 'clients.phoneClicked'
  },
  function Phone ({phone, onClick}) {
    return <a className='level-item'
      onClick={phone ? () => onClick({phone}) : null}>
      <span className='icon is-small'><i className='fa fa-phone' style={phone ? null : {color: '#ccc'}} /></span>
    </a>
  }
)
