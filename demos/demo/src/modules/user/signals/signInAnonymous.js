import signInAnonymously from '../actions/signInAnonymously'
import initNewUser from './initNewUser'

const signInAnonymous = [
  signInAnonymously,
  ...initNewUser
]

export default signInAnonymous
