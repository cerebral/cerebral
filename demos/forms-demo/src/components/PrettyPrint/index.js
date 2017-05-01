import React from 'react'
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'
import {css} from 'aphrodite'
import syntaxHighlight from '../../helpers/syntaxHighlight'
import styles from './styles'
import {form} from 'cerebral-provider-forms'

export default connect({
  form: form(state`${props`currentView`}.form`),
  showPanel: state`app.settings.showErrors`
},
  function PrettyPrint ({form, showPanel}) {
    if (!showPanel) {
      return null
    }
    let result = form.isValid ? form.toJSON() : Object.keys(form.getInvalidFields()).reduce((acc, field) => {
      const {value} = form[field]
      acc[field] = {
        value
      }
      return acc
    }, {})

    const resultPane = css(
      form.isValid ? styles.successPane : styles.errorPane
    )
    return (
      <div className={css(styles.container)}>
        <div className={resultPane}>
          {form.isValid ? 'The form is valid' : 'The form is invalid. See invalid fields below'}
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
