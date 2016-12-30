import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from './utils'

function onChildChangedFactory (pathTemplate, signalTemplate, options = {}) {
  function onChildChanged ({firebase, state, input, controller}) {
    const tagGetters = {state: state.get, input}
    const getSignalPath = (apath) => {
      // make sure it exists
      controller.getSignal(apath)
      return apath
    }
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate
    const signal = signalTemplate instanceof Tag ? signalTemplate.getValue({state: state.get, input, signal: getSignalPath}) : signalTemplate

    firebase.onChildChanged(firebasePath, signal, convertObjectWithTemplates(options, tagGetters))
  }

  return onChildChanged
}

export default onChildChangedFactory
