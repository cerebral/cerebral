import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

export default connect(
  {
    // autoFocus
    enterPressed: signal`projects.enterPressed`,
    escPressed: signal`projects.escPressed`,
    // field
    // placeholderKey
    value: state`projects.$draft.${props`field`}`,
    valueChanged: signal`projects.formValueChanged`,
    t: translations
  },
  function Input ({autoFocus, enterPressed, escPressed, field, placeholderKey, value, valueChanged, t}) {
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
