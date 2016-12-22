import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from './utils'

function onChildRemovedFactory (path, signal, options = {}) {
  function onChildRemoved ({firebase, state, input, controller}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path
    const signalTemplate = signal instanceof Tag ? signal.getValue({state: state.get, input, signal: controller.getSignal.bind(this)}) : signal

    firebase.onChildRemoved(pathTemplate, signalTemplate, convertObjectWithTemplates(options, tagGetters))
  }

  return onChildRemoved
}

export default onChildRemovedFactory
