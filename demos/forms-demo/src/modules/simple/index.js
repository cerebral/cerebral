import {set, when} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'
import {form, changeField, validateForm, resetForm} from 'cerebral-forms'

export default {
  state: {
    form: form({
      firstname: {
        value: '',
        isRequired: true
      },
      lastname: {
        value: '',
        isRequired: true
      },
      email: {
        value: '',
        validationRules: ['isEmail'],
        validationMessages: ['You must enter a valid email'],
        isRequired: false
      },
      showErrors: false
    })
  },
  signals: {
    routed: [
      set(state`app.currentView`, 'Simple')
    ],
    fieldChanged: [
      when(state`${input`settingsField`}.value`), {
        true: [
          set(state`app.settings.showErrors`, true),
          changeField
        ],
        false: [
          set(state`${input`field`}.value`, input`value`)
        ]
      }
    ],
    onSubmitted: [
      set(state`app.settings.showErrors`, true),
      validateForm(state`${input`formPath`}`)
    ],
    onReset: [
      resetForm(state`${input`formPath`}`)
    ]
  }
}
