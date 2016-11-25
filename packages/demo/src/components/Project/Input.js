import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../common/computed/translations'

export default connect(
  ({field}) => ({
    value: `projects.$draft.${field}`,
    t: translations
  }),
  {
    enterPressed: 'projects.enterPressed',
    escPressed: 'projects.escPressed',
    valueChanged: 'projects.formValueChanged'
  },
  function Input ({field, value, placeholderKey, autoFocus, enterPressed, escPressed, valueChanged, t}) {
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
      <input className='input' type='text'
        autoFocus={autoFocus}
        placeholder={t[placeholderKey]}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={value || ''}
        name={field}
        />
    )
  }
)
