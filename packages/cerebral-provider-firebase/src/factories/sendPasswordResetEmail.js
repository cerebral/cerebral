import {Tag} from 'cerebral/tags'

function sendPasswordResetEmailFactory (email) {
  function sendPasswordResetEmail ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const emailTemplate = email instanceof Tag ? email.getValue(tagGetters) : email

    return firebase.sendPasswordResetEmail(emailTemplate)
      .then(path.success)
      .catch(path.error)
  }

  return sendPasswordResetEmail
}

export default sendPasswordResetEmailFactory
