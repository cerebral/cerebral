import {Tag} from 'cerebral/tags'

function offFactory (path, event, signal) {
  function off ({firebase, state, input, controller}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path
    const eventTemplate = event instanceof Tag ? event.getValue(tagGetters) : event
    const signalTemplate = signal instanceof Tag ? signal.getValue({state: state.get, input, signal: controller.getSignal.bind(controller)}) : signal

    firebase.off(pathTemplate, eventTemplate, signalTemplate)
  }

  return off
}

export default offFactory
