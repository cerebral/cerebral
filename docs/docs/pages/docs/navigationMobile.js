import React from 'react'
import TOC from './toc'

function Navigation (props) {
  function renderMenu () {
    return (
      <ul className='docs-navigation-menu mobile'>
        {Object.keys(props.docs).map(function (sectionKey, index) {
          return (
            <li key={index} className={`docs-navigation-item${props.sectionName === sectionKey ? ' active' : ''} mobile`}>
              <a href={`/docs/${sectionKey}`}>{sectionKey.replace('_', ' ')}</a>
              {props.sectionName === sectionKey ? <TOC docName={props.docName} sectionName={props.sectionName} sections={props.docs[props.sectionName]} /> : null}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div id='navigation-mobile' className='docs-navigation mobile'>
      <div id='hamburger' className='docs-navigation-hamburger'>
        &#9776;
      </div>
      <div className='docs-navigation-title mobile'>
        {props.sectionName.replace('_', ' ')}
      </div>
      <div className='docs-navigation-float mobile'>
        {renderMenu()}
      </div>
    </div>
  )
}

export default Navigation
