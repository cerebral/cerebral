import firebase from 'firebase'
import {
  stopListening
} from './helpers'
import signInAnonymouslyService from './signInAnonymously'
import getUserService from './getUser'
import createOnChildAdded from './createOnChildAdded'
import createOnChildRemoved from './createOnChildRemoved'
import createOnChildChanged from './createOnChildChanged'
import createOnValue from './createOnValue'
import createTask from './createTask'
import value from './value'
import createUserWithEmailAndPassword from './createUserWithEmailAndPassword'
import signInWithEmailAndPassword from './signInWithEmailAndPassword'
import signOutService from './signOut'
import signInWithFacebook from './signInWithFacebook'

export function signInAnonymously (context) {
  return context.firebase.signInAnonymously()
    .then(context.path.success)
    .catch(context.path.error)
}

export function getUser (context) {
  return context.firebase.getUser()
    .then(context.path.success)
    .catch(context.path.error)
}

export function signOut (context) {
  return context.firebase.signOut()
    .then(context.path.success)
    .catch(context.path.error)
}

export default function FirebaseProviderFactory (options = { payload: {} }) {
  firebase.initializeApp(options.config)

  let cachedProvider = null
  function FirebaseProvider (context) {
    if (cachedProvider) {
      context.firebase = cachedProvider
    } else {
      context.firebase = cachedProvider = {
        getUser: getUserService,
        signInAnonymously: signInAnonymouslyService,
        signInWithFacebook: signInWithFacebook,
        off: stopListening,
        onChildAdded: createOnChildAdded(context.controller),
        onChildRemoved: createOnChildRemoved(context.controller),
        onChildChanged: createOnChildChanged(context.controller),
        onValue: createOnValue(context.controller),
        value,
        task: createTask(options),
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut: signOutService,
        sendPasswordResetEmail (email) {
          return firebase.auth().sendPasswordResetEmail(email)
        }
      }
    }

    if (context.debugger) {
      context.firebase = Object.keys(context.firebase).reduce((debuggedFirebase, key) => {
        const originalFunc = context.firebase[key]

        debuggedFirebase[key] = (...args) => {
          context.debugger.send({
            method: `firebase.${key}`,
            args: args
          })

          return originalFunc.apply(context.firebase, args)
        }

        return debuggedFirebase
      }, {})
    }

    return context
  }

  return FirebaseProvider
}

/*
export default (options = { payload: {} }) => (module, controller) => {
  controller.addContextProvider({
    'cerebral-module-firebase': module.path
  })
  firebase.initializeApp(options.config)
  module.addServices({

  })
}
*/
