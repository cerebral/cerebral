import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from './utils'

function onChildRemovedFactory (pathTemplate, signalTemplate, options = {}) {
  function onChildRemoved ({firebase, state, input, controller}) {
    const tagGetters = {state: state.get, input}
    const getSignalPath = (apath) => {
      // make sure it exists
      controller.getSignal(apath)
      return apath
    }
    const path = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate
    const signal = signalTemplate instanceof Tag ? signalTemplate.getValue({state: state.get, input, signal: getSignalPath}) : signalTemplate

    firebase.onChildRemoved(path, signal, convertObjectWithTemplates(options, tagGetters))
  }

  return onChildRemoved
}

export default onChildRemovedFactory
