import React from 'react'
import Search from './search'

function Navigation (props) {
  function renderMenu () {
    return Object.keys(props.docs).map(function (sectionKey, index) {
      return (
        <li key={index} className={`docs-navigation-item${props.sectionName === sectionKey ? ' active' : ''}`}>
          <a href={`/docs/${sectionKey}`}>{sectionKey.replace('_', ' ')}</a>
          <div className='underline' />
        </li>
      )
    })
  }

  return (
    <div id='navigation' className='docs-navigation'>
      <ul className='docs-navigation-menu'>
        {renderMenu()}
      </ul>
      <Search />
    </div>
  )
}

export default Navigation
