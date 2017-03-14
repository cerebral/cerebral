import React from 'react'
import Navigation from './navigation'
import NavigationMobile from './navigationMobile'
import TOC from './toc'
import Doc from './doc'

function Docs (props) {
  const doc = props.docs[props.sectionName][props.docName]

  return (
    <div className='docs-container'>
      <Navigation docs={props.docs} sectionName={props.sectionName} docName={props.docName} />
      <NavigationMobile docs={props.docs} sectionName={props.sectionName} docName={props.docName} />
      <div className='docs-content'>
        <TOC docName={props.docName} sectionName={props.sectionName} sections={props.docs[props.sectionName]} />
        <Doc doc={doc.tree} docName={props.docName} sectionName={props.sectionName} />
      </div>
      <div style={{zIndex: 99, backgroundColor: '#DD4A68', color: '#fff', padding: '5px 10px', position: 'fixed', width: '100%', bottom: 0, left: 0}}>
        Docs are still being written and might not be up to date with API
      </div>
    </div>
  )
}

export default Docs
