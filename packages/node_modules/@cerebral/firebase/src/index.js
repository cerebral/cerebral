import { Provider } from 'cerebral'
import firebase from 'firebase'
import { stopListening } from './helpers'
import signInAnonymouslyService from './signInAnonymously'
import getUserService from './getUser'
import onChildAdded from './onChildAdded'
import onChildRemoved from './onChildRemoved'
import onChildChanged from './onChildChanged'
import onValue from './onValue'
import createTask from './createTask'
import value from './value'
import push from './push'
import set from './set'
import update from './update'
import put from './put'
import getDownloadURL from './getDownloadURL'
import deleteFile from './delete'
import remove from './remove'
import transaction from './transaction'
import createUserWithEmailAndPassword from './createUserWithEmailAndPassword'
import signInWithEmailAndPassword from './signInWithEmailAndPassword'
import signOutService from './signOut'
import signInWithFacebook from './signInWithFacebook'
import signInWithGoogle from './signInWithGoogle'
import signInWithGithub from './signInWithGithub'
import signInWithCustomToken from './signInWithCustomToken'
import deleteUser from './deleteUser'
import sendPasswordResetEmail from './sendPasswordResetEmail'
import linkWithFacebook from './linkWithFacebook'
import linkWithGithub from './linkWithGithub'
import linkWithGoogle from './linkWithGoogle'
import { setOnDisconnect, cancelOnDisconnect } from './onDisconnect'

export { FirebaseProviderError } from './errors'
export { FirebaseProviderAuthenticationError } from './errors'

export default function FirebaseProviderFactory(options = { payload: {} }) {
  firebase.initializeApp(options.config)

  return Provider(
    {
      cancelOnDisconnect,
      createUserWithEmailAndPassword,
      delete: deleteFile,
      deleteFile,
      deleteUser,
      getDownloadURL,
      getUser: getUserService,
      linkWithFacebook,
      linkWithGithub,
      linkWithGoogle,
      off: stopListening,
      onChildAdded,
      onChildChanged,
      onChildRemoved,
      onValue,
      push,
      put,
      remove,
      sendPasswordResetEmail,
      set,
      setOnDisconnect,
      signInAnonymously: signInAnonymouslyService,
      signInWithCustomToken: signInWithCustomToken,
      signInWithEmailAndPassword,
      signInWithFacebook: signInWithFacebook,
      signInWithGithub: signInWithGithub,
      signInWithGoogle: signInWithGoogle,
      signOut: signOutService,
      task: createTask(options),
      transaction,
      update,
      value,
    },
    {
      cache: !options.sendTaskExecutionDetails,
    }
  )
}
