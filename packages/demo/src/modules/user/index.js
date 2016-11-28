import {input, set, state} from 'cerebral/operators'
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
    $loginTab: 'SignIn',
    $currentUser: null
  },
  signals: {
    createUserClicked: createFirebaseUser,
    createUserEnterPressed: createFirebaseUser,
    fieldChanged: changeField,
    signInClicked: signInWithFirebase,
    signInEnterPressed: signInWithFirebase,
    signOutClicked: signOutFirebase,
    loginTabClicked: [
      set(state`user.$loginTab`, input`value`)
    ]
  }
}
