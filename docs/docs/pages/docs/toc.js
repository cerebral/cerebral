import React from 'react'

function TOC (props) {
  function renderToc (toc) {
    if (!toc.length) {
      return null
    }

    return (
      <ul>
        {toc.map(function (item, index) {
          return (
            <li key={index}>
              <a href={`#${item.id}`}>{item.title}</a>
              {renderToc(item.children)}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className='docs-toc'>
      <div className='docs-toc-content'>
        <div><strong>Table of contents</strong></div>
        {renderToc(props.toc)}
      </div>
    </div>
  )
}

export default TOC
