import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

export default connect(
  {
    // autoFocus
    enterPressed: signal`${props`moduleName`}.enterPressed`,
    escPressed: signal`${props`moduleName`}.escPressed`,
    // field
    // placeholderKey
    t: translations,
    value: state`${props`moduleName`}.$draft.${props`field`}`,
    valueChanged: signal`${props`moduleName`}.formValueChanged`
  },
  function Input ({autoFocus, enterPressed, escPressed, field, placeholderKey, t, value, valueChanged}) {
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
        placeholder={t[placeholderKey]}
        onKeyPress={onKeyPress}
        onChange={onChange}
        name={field}
        value={value || ''}
        />
    )
  }
)
