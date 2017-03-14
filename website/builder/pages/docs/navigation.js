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
      <div className='docs-icons'>
        <a href='https://github.com/cerebral/cerebral' className='docs-icon' target='_new'>
          <div className='docs-icon-github' />
          github repo
        </a>
        <a href='https://discord.gg/0kIweV4bd2bwwsvH' className='docs-icon' target='_new'>
          <div className='docs-icon-discord' />
          chat
        </a>
        <a href='http://cerebral-website.herokuapp.com/' className='docs-icon' target='_new' style={{color: '#DD4A68'}}>
          old website
        </a>
      </div>
    </div>
  )
}

export default Navigation
