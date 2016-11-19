import {set, state, input} from 'cerebral/operators'
import {form, changeField, validateForm} from 'cerebral-forms'

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
      }
    })
  },
  signals: {
    routed: [
      set(state`app.currentView`, 'Simple')
    ],
    fieldChanged: changeField,
    validateEntireForm: [
      validateForm(input`formPath`)
    ]
  }
}
