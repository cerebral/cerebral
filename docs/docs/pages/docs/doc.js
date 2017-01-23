import React from 'react'

function Doc (props) {
  return (
    <div className='docs-doc'>
      <div className='docs-doc-edit'>
        <a href={`https://github.com/cerebral/cerebral/edit/master/docs/docs/${props.docName}.md`} target='_new'>Edit on Github</a>
      </div>
      <div className='docs-doc-content'>
        <div style={{backgroundColor: '#DD4A68', color: '#fff', margin: '10px', padding: '5px 10px', borderRadius: '3px'}}>
          Docs are still being written and might not be up to date with API
        </div>

        {props.doc}
      </div>
    </div>
  )
}

export default Doc
