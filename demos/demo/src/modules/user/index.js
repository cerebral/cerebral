import {set} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import createUser from './signals/createUser'
import signIn from './signals/signIn'
import signInAnonymous from './signals/signInAnonymous'
import signOut from './signals/signOut'
import {setField} from 'cerebral-provider-forms/operators'

export default {
  state: {
    lang: 'en',
    $loggedIn: false,
    $signIn: {
      email: {
        value: '',
        validationRules: ['isEmail'],
        validationMessages: {
          'isEmail': 'loginValidationEmailNotValid'
        },
        isRequired: true,
        requiredMessage: 'loginValidationEmailRequired'
      },
      password: {
        value: '',
        validationRules: ['minLength:5'],
        validationMessages: {
          'minLength': 'loginValidationPasswordTooShort'
        },
        isRequired: true,
        requiredMessage: 'loginValidationPasswordRequired'
      },
      showErrors: false
    },
    $loginTab: 'SignIn',
    $currentUser: null
  },
  signals: {
    createUserClicked: createUser,
    createUserEnterPressed: createUser,
    fieldChanged: [
      setField(state`${props`field`}`, props`value`)
    ],
    signInAnonClicked: signInAnonymous,
    signInClicked: signIn,
    signInEnterPressed: signIn,
    signOutClicked: signOut,
    loginTabClicked: [
      set(state`user.$loginTab`, props`value`)
    ]
  }
}
