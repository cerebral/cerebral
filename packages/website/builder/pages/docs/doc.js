import React from 'react'

function Doc(props) {
  return (
    <div className="docs-doc">
      <div className="docs-doc-content">
        <div className="docs-doc-edit">
          <a href={props.githubUrl} target="_new">Edit on Github</a>
        </div>
        {props.doc}
      </div>
    </div>
  )
}

export default Doc
