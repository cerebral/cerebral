function parseAndRunMessages ({props, state, controller}) {
  state.set('debugger.isCatchingUp', true)
  props.data.messages.forEach(function (message) {
    controller.getSignal('debugger.payloadReceived')(JSON.parse(message))
  })
  state.set('debugger.isCatchingUp', false)
}

export default parseAndRunMessages
