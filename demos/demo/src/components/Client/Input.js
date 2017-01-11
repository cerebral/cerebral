import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

export default connect(
  {
    enterPressed: signal`clients.enterPressed`,
    escPressed: signal`clients.escPressed`,
    value: state`clients.$draft.${props`field`}`,
    valueChanged: signal`clients.formValueChanged`,
    t: translations
  },
  function Input ({autoFocus, enterPressed, escPressed, field, icon, placeholderKey, type, value, valueChanged, t, warning}) {
    const onKeyDown = e => {
      switch (e.key) {
        case 'Enter': enterPressed(); break
        case 'Escape': escPressed(); break
        default: break // noop
      }
    }

    const onChange = e => {
      let value
      if (type === 'file') {
        value = e.target.files[0]
        // e.stopPropagation()
        // e.preventDefault()
        // $imageFile
        valueChanged({key: `$${field}File`, value})
      } else {
        value = e.target.value
        valueChanged({key: field, value})
      }
    }

    // FIXME: customize input.file and show $imageFile file.name if present.

    return (
      <p className={`control${icon ? ' has-icon' : ''}`}>
        <input className={`input${warning ? ' is-danger' : ''}`} type={type || 'text'}
          autoFocus={autoFocus}
          placeholder={t[placeholderKey]}
          onKeyDown={onKeyDown}
          onChange={onChange}
          value={type === 'file' ? '' : (value || '')}
          name={field}
          />
        {icon && <i className={`fa fa-${icon}`} />}
        {warning && <span className='help is-warning'>{warning}</span>}
      </p>
    )
  }
)
