import React from 'react'
import Navigation from './navigation'
import TOC from './toc'
import Doc from './doc'
import Footer from './footer'

function Docs (props) {
  const doc = props.docs[props.sectionName][props.docName]

  return (
    <div className='docs-container'>
      <Navigation docs={props.docs} sectionName={props.sectionName} docName={props.docName} />
      <div className='docs-content'>
        <TOC toc={doc.toc} />
        <Doc doc={doc.tree} docName={props.docName} />
      </div>
      <Footer />
    </div>
  )
}

export default Docs
