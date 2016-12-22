import {Tag} from 'cerebral/tags'

function signInWithEmailAndPasswordFactory (email, password) {
  function signInWithEmailAndPassword ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const emailTemplate = email instanceof Tag ? email.getValue(tagGetters) : email
    const passwordTemplate = password instanceof Tag ? password.getValue(tagGetters) : password

    return firebase.signInWithEmailAndPassword(emailTemplate, passwordTemplate)
      .then(path.success)
      .catch(path.error)
  }

  return signInWithEmailAndPassword
}

export default signInWithEmailAndPasswordFactory
