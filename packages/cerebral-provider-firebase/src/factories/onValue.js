import {Tag} from 'cerebral/tags'

function onValueFactory (pathTemplate, signalTemplate) {
  function onValue ({firebase, state, input, controller}) {
    const tagGetters = {state: state.get, input}
    const path = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate
    const signal = signalTemplate instanceof Tag ? signalTemplate.getValue({state: state.get, input, signal: controller.getSignal.bind(controller)}) : signalTemplate

    firebase.onValue(path, signal)
  }

  return onValue
}

export default onValueFactory
