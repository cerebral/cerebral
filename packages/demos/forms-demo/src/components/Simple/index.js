import React from 'react'
import { connect } from 'cerebral/react'
import { state, signal } from 'cerebral/tags'
import { css } from 'aphrodite'
import styles from './styles'
import Input from '../Fields/Input'
import { form } from '@cerebral/forms'

export default connect(
  {
    form: form(state`simple.form`),
    settings: state`app.settings`,
    onSubmitted: signal`simple.onSubmitted`,
    onReset: signal`simple.onReset`,
  },
  function Simple({ form, settings, onSubmitted, onReset }) {
    const { disableSubmitWhenFormIsInValid } = settings
    let enabled = true
    let buttonStyle = css(styles.button, styles.enabled)
    const resetButtonStyle = buttonStyle
    if (disableSubmitWhenFormIsInValid.value) {
      enabled = form.isValid
      buttonStyle = css(styles.button, enabled ? null : styles.disabled)
    }
    return (
      <div>
        <span style={{ fontSize: 24, fontWeight: 400 }}>Simple Example</span>
        <div style={{ marginTop: 5, paddingTop: 20, fontSize: 13 }}>
          This is a simple example with three fields where firstname and
          lastname is required. Email is not required but if
          you fill in a value it must be validated as an email. The form result
          will be showed in the panel at the bottom.
        </div>
        <div style={{ marginTop: 40 }}>
          {Object.keys(form.getFields()).map((field, index) => {
            return (
              <Input name={field} key={index} path={`simple.form.${field}`} />
            )
          })}
        </div>
        <div style={{ marginTop: 50 }}>
          <button
            onClick={e => onSubmitted({ formPath: 'simple.form' })}
            disabled={!enabled}
            className={buttonStyle}
          >
            Submit
          </button>
          <button
            onClick={e => onReset({ formPath: 'simple.form' })}
            className={resetButtonStyle}
          >
            Reset
          </button>
        </div>
      </div>
    )
  }
)
