import createUserWithEmailAndPassword
  from '../actions/createUserWithEmailAndPassword'
import initNewUser from './initNewUser'
import { isValidForm } from '@cerebral/forms/operators'
import { state } from 'cerebral/tags'
import { set } from 'cerebral/operators'

const createUser = [
  isValidForm(state`user.$signIn`),
  {
    true: [createUserWithEmailAndPassword, ...initNewUser],
    false: [set(state`user.$signIn.showErrors`, true)],
  },
]

export default createUser
