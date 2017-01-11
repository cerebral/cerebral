import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import {form, changeField} from 'cerebral-forms'
import createUser from './signals/createUser'
import signIn from './signals/signIn'
import signInAnonymous from './signals/signInAnonymous'
import signOut from './signals/signOut'

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
    createUserClicked: createUser,
    createUserEnterPressed: createUser,
    fieldChanged: changeField,
    signInAnonClicked: signInAnonymous,
    signInClicked: signIn,
    signInEnterPressed: signIn,
    signOutClicked: signOut,
    loginTabClicked: [
      set(state`user.$loginTab`, input`value`)
    ]
  }
}
