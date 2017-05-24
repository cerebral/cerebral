import React from 'react'

export default function Phone ({email}) {
  return (
    <a className='level-item' target='_blank'
      href={email && `mailto:${email}`}>
      <span className='icon is-small'>
        <i className='fa fa-envelope' style={email ? null : {color: '#ccc'}} />
      </span>
    </a>
  )
}
