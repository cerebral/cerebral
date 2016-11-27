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
import push from './push'
import set from './set'
import update from './update'
import remove from './remove'
import transaction from './transaction'
import createUserWithEmailAndPassword from './createUserWithEmailAndPassword'
import signInWithEmailAndPassword from './signInWithEmailAndPassword'
import signOutService from './signOut'
import signInWithFacebook from './signInWithFacebook'

export {default as createUserWithEmailAndPassword} from './factories/createUserWithEmailAndPassword'
export {default as getUser} from './factories/getUser'
export {default as off} from './factories/off'
export {default as onChildAdded} from './factories/onChildAdded'
export {default as onChildChanged} from './factories/onChildChanged'
export {default as onChildRemoved} from './factories/onChildRemoved'
export {default as onValue} from './factories/onValue'
export {default as sendPasswordResetEmail} from './factories/sendPasswordResetEmail'
export {default as signInAnonymously} from './factories/signInAnonymously'
export {default as signInWithEmailAndPassword} from './factories/signInWithEmailAndPassword'
export {default as signInWithFacebook} from './factories/signInWithFacebook'
export {default as signOut} from './factories/signOut'
export {default as task} from './factories/task'
export {default as value} from './factories/value'
export {default as set} from './factories/set'
export {default as update} from './factories/update'
export {default as push} from './factories/push'
export {default as remove} from './factories/remove'
export {default as transaction} from './factories/transaction'

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
        push,
        update,
        set,
        remove,
        transaction,
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
