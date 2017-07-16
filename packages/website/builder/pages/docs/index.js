import React from 'react'
import Nav from './nav'
import Doc from './doc'

function Docs(props) {
  const doc = props.docs[props.sectionName][props.docName]

  return (
    <div id="docs-container">
      <div id="nav_mobile-header">
        <div id="hamburger" />
        <div id="nav_mobile-title">
          {`${props.sectionName} ▸ ${doc.toc[0].title}`}
        </div>
      </div>
      <Nav
        docs={props.docs}
        sectionName={props.sectionName}
        docName={props.docName}
      />
      <Doc
        doc={doc.tree}
        docName={props.docName}
        sectionName={props.sectionName}
        githubUrl={doc.githubUrl}
      />
    </div>
  )
}

export default Docs
