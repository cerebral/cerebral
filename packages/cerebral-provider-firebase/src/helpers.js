import firebase from 'firebase'
import {FirebaseProviderError} from './errors'
const refs = {}

export function createRef (path, options = {}) {
  if (path.indexOf('/') >= 0) {
    throw new FirebaseProviderError('The path "' + path + '" is not valid. Use dot notation for consistency with Cerebral')
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
    throw new FirebaseProviderError('The path "' + path + '" is not valid. Use dot notation for consistency with Cerebral')
  }
  path = path.replace(/\./g, '/')
  return firebase.storage().ref(path)
}

export function listenTo (ref, path, event, signal, cb) {
  refs[path] = refs[path] || {}
  refs[path][event] = refs[path][event] ? refs[path][event].concat(ref) : [ref]

  ref.on(event, cb, (error) => {
    throw new FirebaseProviderError(event + ' listener to path ' + path + ', triggering signal: ' + signal + ', gave error: ' + error.message)
  })
}

const events = {
  'onChildAdded': 'child_added',
  'onChildChanged': 'child_changed',
  'onChildRemoved': 'child_removed',
  'onValue': 'value',
  '*': '*'
}

export function stopListening (passedPath, event) {
  const realEventName = events[event] || '*'
  const pathArray = passedPath.split('.')
  let path = passedPath
  let isWildcardPath = false

  if (event && !realEventName) {
    throw new FirebaseProviderError('The event "' + event + '" is not a valid event. Use: "' + Object.keys(events))
  }

  if (pathArray[pathArray.length - 1] === '*') {
    isWildcardPath = true
    pathArray.pop()
    path = pathArray.join('.')
  }

  if (isWildcardPath) {
    const refsHit = Object.keys(refs).reduce((currentKeysHit, ref) => {
      if (ref.indexOf(path) === 0) {
        return currentKeysHit.concat(ref)
      }

      return currentKeysHit
    }, [])

    if (!refsHit.length) {
      throw new FirebaseProviderError('The path "' + path + '" has no listeners')
    }

    refsHit.forEach((ref) => {
      if (realEventName === '*') {
        Object.keys(refs[ref]).forEach((eventName) => {
          refs[ref][eventName].forEach((listener) => listener.off())
          delete refs[ref][eventName]
        })
      } else {
        refs[ref][realEventName].forEach((listener) => listener.off())
        delete refs[ref][realEventName]
      }

      if (Object.keys(refs[ref]).length === 0) {
        delete refs[ref];
      }
    })
  } else {
    if (!refs[path]) {
      throw new FirebaseProviderError('The path "' + path + '" has no listeners')
    }

    if (realEventName && !refs[path][realEventName]) {
      throw new FirebaseProviderError('The event "' + realEventName + '" has no listeners on path "' + path + '"')
    }

    refs[path][realEventName].forEach((listener) => listener.off())
    delete refs[path][realEventName]
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
