import signOut from '../actions/signOut'

const signOutFirebase = [
  signOut,
  {
    success: [() => window.location.reload(true)],
    error: [],
  },
]

export default signOutFirebase
