import createUserWithEmailAndPassword from '../actions/createUserWithEmailAndPassword'
import initNewUser from './initNewUser'

const createUser = [
  createUserWithEmailAndPassword,
  ...initNewUser
]

export default createUser
