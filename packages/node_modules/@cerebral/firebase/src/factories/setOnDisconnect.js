export default function setOnDisconnectFactory(setPath, value) {
  function setOnDisconnect({ firebase, resolve }) {
    firebase.setOnDisconnect(resolve.value(setPath), resolve.value(value))
  }

  return setOnDisconnect
}
