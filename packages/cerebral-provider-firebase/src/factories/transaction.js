import {Tag} from 'cerebral/tags'

function transactionFactory (path, transactionFunction) {
  function transaction ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path

    return firebase.transaction(pathTemplate, transactionFunction)
      .then(path.success)
      .catch(path.error)
  }

  return transaction
}

export default transactionFactory
