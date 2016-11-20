import React from 'react'
import {connect} from 'cerebral/react'
import {css} from 'aphrodite'
import styles from './styles'

export default connect((props) => (
  {
    'field': `${props.path}.**`,
    'settings': 'app.settings.**'
  }),
  {
    fieldChanged: 'simple.fieldChanged'
  },
  function Input ({name, field, path, settings, fieldChanged}) {
    function onChange (e) {
      fieldChanged({
        field: path,
        value: e.target.value
      })
    }

    function renderError () {
      const {errorMessage} = field
      return (
        <div style={{color: '#d64242', fontSize: 11}}>
          {errorMessage}
        </div>
      )
    }
    return (
      <div style={{marginTop: 10, fontSize: 14}}>
        {name} {field.isRequired ? '*' : ''}<br />
        <input onChange={(e) => onChange(e)} type={'text'} className={css(styles.input)} />
        {renderError()}
      </div>
    )
  }
)
