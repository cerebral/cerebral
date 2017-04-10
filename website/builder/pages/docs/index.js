import React from 'react'
import Navigation from './navigation'
import NavigationMobile from './navigationMobile'
import TOC from './toc'
import Doc from './doc'

function Docs (props) {
  const doc = props.docs[props.sectionName][props.docName]

  return (
    <div className='docs-container'>
      <div className='beta'>beta</div>
      <Navigation docs={props.docs} sectionName={props.sectionName} docName={props.docName} />
      <NavigationMobile docs={props.docs} sectionName={props.sectionName} docName={props.docName} />
      <div className='docs-content'>
        <TOC docName={props.docName} sectionName={props.sectionName} sections={props.docs[props.sectionName]} />
        <Doc doc={doc.tree} docName={props.docName} sectionName={props.sectionName} githubUrl={doc.githubUrl}/>
      </div>
    </div>
  )
}

export default Docs
