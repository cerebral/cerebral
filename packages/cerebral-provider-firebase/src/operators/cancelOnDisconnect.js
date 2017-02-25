export default function cancelOnDisconnectFactory () {
  function cancelOnDisconnect ({firebase, resolve}) {
    firebase.cancelOnDisconnect()
  }

  return cancelOnDisconnect
}
