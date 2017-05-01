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
import put from './put'
import deleteOp from './delete'
import remove from './remove'
import transaction from './transaction'
import createUserWithEmailAndPassword from './createUserWithEmailAndPassword'
import signInWithEmailAndPassword from './signInWithEmailAndPassword'
import signOutService from './signOut'
import signInWithFacebook from './signInWithFacebook'
import signInWithGoogle from './signInWithGoogle'
import signInWithGithub from './signInWithGithub'
import deleteUser from './deleteUser'
import sendPasswordResetEmail from './sendPasswordResetEmail'
import linkWithGithub from './linkWithGithub'
import {setOnDisconnect, cancelOnDisconnect} from './onDisconnect'

export {FirebaseProviderError} from './errors'
export {FirebaseProviderAuthenticationError} from './errors'

export default function FirebaseProviderFactory (options = { payload: {} }) {
  firebase.initializeApp(options.config)

  let cachedProvider = null
  function FirebaseProvider (context, functionDetails) {
    if (cachedProvider) {
      context.firebase = cachedProvider
    } else {
      context.firebase = cachedProvider = {
        getUser: getUserService,
        signInAnonymously: signInAnonymouslyService,
        signInWithFacebook: signInWithFacebook,
        signInWithGoogle: signInWithGoogle,
        signInWithGithub: signInWithGithub,
        off: stopListening,
        onChildAdded: createOnChildAdded(context.controller),
        onChildRemoved: createOnChildRemoved(context.controller),
        onChildChanged: createOnChildChanged(context.controller),
        onValue: createOnValue(context.controller),
        value,
        push,
        put,
        linkWithGithub,
        delete: deleteOp,
        update,
        set,
        remove,
        transaction,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut: signOutService,
        deleteUser,
        sendPasswordResetEmail,
        setOnDisconnect,
        cancelOnDisconnect
      }
    }

    context.firebase.task = createTask(options, context.execution.id, functionDetails.functionIndex)

    if (context.debugger) {
      context.debugger.wrapProvider('firebase')
    }

    return context
  }

  return FirebaseProvider
}
