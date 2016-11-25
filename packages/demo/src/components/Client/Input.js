import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../common/computed/translations'

export default connect(
  ({field}) => ({
    value: `clients.$draft.${field}`,
    t: translations
  }),
  {
    enterPressed: 'clients.enterPressed',
    escPressed: 'clients.escPressed',
    valueChanged: 'clients.formValueChanged'
  },
  function Input ({autoFocus, field, icon, placeholderKey, value, warning, enterPressed, escPressed, valueChanged, t}) {
    const onKeyDown = e => {
      switch (e.key) {
        case 'Enter': enterPressed(); break
        case 'Escape': escPressed(); break
        default: break // noop
      }
    }

    const onChange = e => {
      valueChanged({key: field, value: e.target.value})
    }

    return (
      <p className={`control${icon ? ' has-icon' : ''}`}>
        <input className={`input${warning ? ' is-danger' : ''}`} type='text'
          autoFocus={autoFocus}
          placeholder={t[placeholderKey]}
          onKeyDown={onKeyDown}
          onChange={onChange}
          value={value || ''}
          name={field}
          />
        {icon && <i className={`fa fa-${icon}`} />}
        {warning && <span class='help is-warning'>{warning}</span>}
      </p>
    )
  }
)
