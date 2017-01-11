import React from 'react'
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'
import {isValidForm, getInvalidFormFields, formToJSON} from 'cerebral-forms'
import {css} from 'aphrodite'
import syntaxHighlight from '../../helpers/syntaxHighlight'
import styles from './styles'

export default connect({
  form: state`${props`currentView`}.form.**`,
  showPanel: state`app.settings.showErrors`
},
  function PrettyPrint ({form, showPanel}) {
    if (!showPanel) {
      return null
    }
    const isValid = isValidForm(form)
    let invalidFormFields = getInvalidFormFields(form)
    let result = Object.keys(invalidFormFields).reduce((acc, field) => {
      const {value} = invalidFormFields[field]
      acc[field] = {
        value
      }
      return acc
    }, {})
    if (isValid) {
      result = formToJSON(form)
    }
    const resultPane = css(
      isValid ? styles.successPane : styles.errorPane
    )
    return (
      <div className={css(styles.container)}>
        <div className={resultPane}>
          {isValid ? 'The form is valid' : 'The form is invalid. See invalid fields below'}
        </div>
        <div className={css(styles.innerContainer)}>
          <pre
            className={css(styles.pretty)}
            dangerouslySetInnerHTML={{__html: syntaxHighlight(JSON.stringify(result, undefined, 2))}}
          />
        </div>
      </div>
    )
  }
)
