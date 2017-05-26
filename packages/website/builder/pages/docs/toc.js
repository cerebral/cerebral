import React from 'react'

function TOC(props) {
  function renderToc(toc) {
    if (!toc.length) {
      return null
    }

    return (
      <ul>
        {toc.map(function(item, index) {
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
    <div className="docs-toc">
      <div className="docs-toc-content">
        <div><strong>Table of contents</strong></div>
        <ul>
          {Object.keys(props.sections).map((sectionKey, index) => {
            return (
              <li
                key={index}
                className={sectionKey === props.docName ? 'active' : null}
              >
                <a
                  href={
                    index === 0
                      ? `/docs/${props.sectionName}/index.html`
                      : `/docs/${props.sectionName}/${sectionKey}.html`
                  }
                >
                  {props.sections[sectionKey].toc[0].title}
                </a>
                {sectionKey === props.docName
                  ? renderToc(props.sections[sectionKey].toc[0].children)
                  : null}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default TOC
