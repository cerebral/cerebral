export default function firebaseListen ({moduleName, firebasePath, uidPath, childAddedOptions}) {
  return function ({firebase, state}) {
    const signalName = firebasePath.replace('.', '_')
    let uid = ''
    if (uidPath) {
      // firebase collection is under an user_id
      uid = `.${state.get(uidPath)}`
    }

    firebase.onChildAdded(`${firebasePath}${uid}`, `${moduleName}.${signalName}_ChildAdded`,
      childAddedOptions
    )
    firebase.onChildRemoved(`${firebasePath}${uid}`, `${moduleName}.${signalName}_ChildRemoved`, {})
    firebase.onChildChanged(`${firebasePath}${uid}`, `${moduleName}.${signalName}_ChildChanged`, {})
  }
}
