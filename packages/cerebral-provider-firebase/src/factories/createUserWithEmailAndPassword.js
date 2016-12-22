import {Tag} from 'cerebral/tags'

function createUserWithEmailAndPasswordFactory (email, password) {
  function createUserWithEmailAndPassword ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const emailTemplate = email instanceof Tag ? email.getValue(tagGetters) : email
    const passwordTemplate = password instanceof Tag ? password.getValue(tagGetters) : password

    return firebase.createUserWithEmailAndPassword(emailTemplate, passwordTemplate)
      .then(path.success)
      .catch(path.error)
  }

  return createUserWithEmailAndPassword
}

export default createUserWithEmailAndPasswordFactory
