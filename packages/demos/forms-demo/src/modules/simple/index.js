import { set, when } from 'cerebral/operators'
import { state, props } from 'cerebral/tags'
import { setField, resetForm } from '@cerebral/forms/operators'

export default {
  state: {
    form: {
      firstname: {
        value: '',
        isRequired: true,
      },
      lastname: {
        value: '',
        isRequired: true,
      },
      email: {
        value: '',
        validationRules: ['isEmail'],
        validationMessages: ['You must enter a valid email'],
        isRequired: false,
      },
      showErrors: false,
    },
  },
  signals: {
    routed: [set(state`app.currentView`, 'Simple')],
    fieldChanged: [
      when(state`${props`settingsField`}.value`),
      {
        true: [
          set(state`app.settings.showErrors`, true),
          setField(state`${props`field`}`, props`value`),
        ],
        false: [set(state`${props`field`}.value`, props`value`)],
      },
    ],
    onSubmitted: [set(state`app.settings.showErrors`, true)],
    onReset: [resetForm(state`${props`formPath`}`)],
  },
}
