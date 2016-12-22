import {Tag} from 'cerebral/tags'

function onValueFactory (path, signal) {
  function onValue ({firebase, state, input, controller}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path
    const signalTemplate = signal instanceof Tag ? signal.getValue({state: state.get, input, signal: controller.getSignal.bind(this)}) : signal

    firebase.onValue(pathTemplate, signalTemplate)
  }

  return onValue
}

export default onValueFactory
