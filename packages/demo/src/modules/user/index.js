import {form, changeField} from 'cerebral-forms'
import createFirebaseUser from './signals/createFirebaseUser'
import signInWithFirebase from './signals/signInWithFirebase'
import signOutFirebase from './signals/signOutFirebase'

export default {
  state: {
    lang: 'en',
    $loggedIn: false,
    $signIn: form({
      email: {
        value: '',
        validationRules: ['isEmail'],
        validationMessages: ['loginValidationEmailNotValid'],
        isRequired: true,
        requiredMessage: 'loginValidationEmailRequired'
      },
      password: {
        value: '',
        validationRules: ['minLength:5'],
        validationMessages: ['loginValidationPasswordTooShort'],
        isRequired: true,
        requiredMessage: 'loginValidationPasswordRequired'
      },
      showErrors: false
    }),
    $currentUser: null
  },
  signals: {
    fieldChanged: changeField,
    createUserClicked: createFirebaseUser,
    signInClicked: signInWithFirebase,
    signOutClicked: signOutFirebase
  }
}
