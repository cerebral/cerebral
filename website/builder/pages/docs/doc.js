import React from 'react'

function Doc (props) {
  return (
    <div className='docs-doc'>
      <div className='docs-doc-content'>
        <div className='docs-doc-edit'>
          <a href={`https://github.com/cerebral/cerebral/tree/master/docs/${props.sectionName}/${props.docName}.md`} target='_new'>Edit on Github</a>
        </div>
        {props.doc}
      </div>
    </div>
  )
}

export default Doc
