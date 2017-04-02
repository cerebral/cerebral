import firebase from 'firebase'
const refs = {}

export function createRef (path, options = {}) {
  if (path.indexOf('/') >= 0) {
    throw new Error('cerebral-module-firebase: The path "' + path + '" is not valid. Use dot notation for consistency with Cerebral')
  }
  path = path.replace(/\./g, '/')
  return Object.keys(options).reduce((ref, key) => {
    if (key === 'payload') {
      return ref
    }
    return ref[key](options[key])
  }, firebase.database().ref(path))
}

export function createStorageRef (path) {
  if (path.indexOf('/') >= 0) {
    throw new Error('cerebral-module-firebase: The path "' + path + '" is not valid. Use dot notation for consistency with Cerebral')
  }
  path = path.replace(/\./g, '/')
  return firebase.storage().ref(path)
}

export function listenTo (ref, path, event, signal, cb) {
  refs[path] = refs[path] || {}
  refs[path][event] = refs[path][event] || {}
  if (refs[path][event][signal]) {
    refs[path][event][signal].off()
  }
  refs[path][event][signal] = ref
  ref.on(event, cb, (error) => {
    throw new Error('cerebral-module-firebase: ' + event + ' listener to path ' + path + ', triggering signal: ' + signal + ', gave error: ' + error.message)
  })
}

const events = {
  'onChildAdded': 'child_added',
  'onChildChanged': 'child_changed',
  'onChildRemoved': 'child_removed',
  'onValue': 'value'
}

export function stopListening (path, event, signal) {
  const realEventName = events[event]

  if (event && !realEventName) {
    throw new Error('cerebral-module-firebase - The event "' + event + '" is not a valid event. Use: "' + Object.keys(events))
  }

  if (!refs[path]) {
    throw new Error('cerebral-module-firebase - The path "' + path + '" has no listeners')
  }

  if (realEventName && !refs[path][realEventName]) {
    throw new Error('cerebral-module-firebase - The event "' + realEventName + '" has no listeners on path "' + path + '"')
  }

  if (signal && !refs[path][realEventName][signal]) {
    throw new Error('cerebral-module-firebase - The signal "' + signal + '" has no listeners on path "' + path + '" and event "' + realEventName + '"')
  }

  if (!event && !signal) {
    refs[path].off()
    delete refs[path]
  } else if (!signal) {
    refs[path][realEventName].off()
    delete refs[path][realEventName]
  } else {
    refs[path][realEventName][signal].off()
    delete refs[path][realEventName][signal]
  }
}

export function createUser (user) {
  return {
    uid: user.uid,
    isAnonymous: user.isAnonymous,
    providerData: user.providerData,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL
  }
}

export function createReturnPromise (returnPromise, path) {
  let promise = returnPromise

  if (path && path.success) {
    promise = promise.then(path.success)
  }
  if (path && path.error) {
    promise = promise.catch((error) => {
      return path.error({error: error.message})
    })
  }

  return promise
}

export function convertObjectWithTemplates (obj, resolve) {
  if (resolve.isTag(obj)) {
    return resolve.value(obj)
  }

  return Object.keys(obj).reduce((convertedObject, key) => {
    convertedObject[key] = resolve.value(obj[key])

    return convertedObject
  }, {})
}

export function noop () {}
