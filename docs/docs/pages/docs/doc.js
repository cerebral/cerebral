import React from 'react'

function Doc (props) {
  return (
    <div className='docs-doc'>
      <div className='docs-doc-edit'>
        <a href={`https://github.com/cerebral/cerebral/edit/master/docs/docs/${props.docName}.md`} target='_new'>Edit on Github</a>
      </div>
      <div className='docs-doc-content'>
        {props.doc}
      </div>
    </div>
  )
}

export default Doc
