import React from 'react'
import { connect } from 'cerebral/react'
export default connect({
  value: 'sas.originalValue'
}, {
  saveButtonClicked: 'sas.saveButtonClicked'
}, function Input (props) {
  return (
    <div className='c-input-group'>
      <div className='o-field'>
        <div
          id='value'
          className='c-field'
          contentEditable
          suppressContentEditableWarning>
          { props.value }
        </div>
      </div>
      <button
        onClick={(event) => props.saveButtonClicked({
          value: document.getElementById('value').innerText
        })}
        className='c-button c-button--brand'>
        Save
      </button>
    </div>
  )
}
)
