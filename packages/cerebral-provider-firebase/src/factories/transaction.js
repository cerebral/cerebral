import {Tag} from 'cerebral/tags'

function transactionFactory (pathTemplate, transactionFunction) {
  function transaction ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate

    return firebase.transaction(firebasePath, transactionFunction)
      .then(path.success)
      .catch(path.error)
  }

  return transaction
}

export default transactionFactory
