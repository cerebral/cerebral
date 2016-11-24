import React from 'react'
import {connect} from 'cerebral/react'

export default connect(
  ({moduleName, field}) => ({
    value: `${moduleName}.$draft.${field}`
  }),
  ({moduleName}) => ({
    enterPressed: `${moduleName}.enterPressed`,
    escPressed: `${moduleName}.escPressed`,
    valueChanged: `${moduleName}.formValueChanged`
  }),
  function Input ({field, value, placeholder, autoFocus, enterPressed, escPressed, valueChanged}) {
    const onKeyPress = e => {
      switch (e.key) {
        case 'Enter': enterPressed(); break
        case 'Esc': escPressed(); break
        default: break // noop
      }
    }

    const onChange = e => {
      valueChanged({key: field, value: e.target.value})
    }

    return (
      <textarea className='textarea'
        autoFocus={autoFocus}
        placeholder={placeholder}
        onKeyPress={onKeyPress}
        onChange={onChange}
        name={field}
        value={value || ''}
        />
    )
  }
)
