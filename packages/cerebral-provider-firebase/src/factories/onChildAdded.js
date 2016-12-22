import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from './utils'

function onChildAddedFactory (path, signal, options = {}) {
  function onChildAdded ({firebase, state, input, controller}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path
    const signalTemplate = signal instanceof Tag ? signal.getValue({state: state.get, input, signal: controller.getSignal.bind(this)}) : signal

    firebase.onChildAdded(pathTemplate, signalTemplate, convertObjectWithTemplates(options, tagGetters))
  }

  return onChildAdded
}

export default onChildAddedFactory
