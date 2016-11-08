import React from 'react'
import { connect } from 'cerebral/react'
export default connect({
  value: 'repoName'
}, {
  buttonClicked: 'getRepoInfoClicked'
}, function Input (props) {
  return (
    <div className='c-input-group'>
      <div className='o-field'>
        <div
          id='reponame'
          className='c-field'
          contentEditable
          suppressContentEditableWarning>
          { props.value }
        </div>
      </div>
      <button
        onClick={(event) => props.buttonClicked({
          value: document.getElementById('reponame').innerText
        })}
        className='c-button c-button--info'>
        Get Repo Info
      </button>
    </div>
  )
}
)
