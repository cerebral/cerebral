function parseAndRunMessages ({input, controller}) {
  input.data.messages.forEach(function (message) {
    controller.getSignal('debugger.payloadReceived')(JSON.parse(message))
  })
}

export default parseAndRunMessages
