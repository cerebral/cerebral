import React from 'react'
import {connect} from 'cerebral/react'
import {state, props, signal} from 'cerebral/tags'
import {css} from 'aphrodite'
import styles from './styles'

export default connect({
  field: state`${props`path`}.**`,
  settings: state`app.settings.**`,
  fieldChanged: signal`simple.fieldChanged`
},
  function Input ({name, field, path, settings, fieldChanged}) {
    function onChange (e) {
      fieldChanged({
        field: path,
        value: e.target.value,
        settingsField: 'app.settings.validateOnChange'
      })
    }
    function onBlur (e) {
      fieldChanged({
        field: path,
        value: e.target.value,
        settingsField: 'app.settings.validateInputOnBlur'
      })
    }
    function renderError () {
      const {errorMessage} = field
      const {showErrors} = settings
      return (
        <div style={{color: '#d64242', fontSize: 11}}>
          {showErrors && errorMessage}
        </div>
      )
    }
    return (
      <div style={{marginTop: 10, fontSize: 14}}>
        {name} {field.isRequired ? '*' : ''}<br />
        <input onChange={(e) => onChange(e)} onBlur={(e) => onBlur(e)} value={field.value} type={'text'} className={css(styles.input)} />
        {renderError()}
      </div>
    )
  }
)
