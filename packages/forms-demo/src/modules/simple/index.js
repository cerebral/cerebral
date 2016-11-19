import {set, state} from 'cerebral/operators'
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
        errorMessages: ['You must enter a valid email'],
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
      validateForm('simple.form')
    ]
  }
}
