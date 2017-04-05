import firebaseAdmin from 'firebase-admin'

function noReturnValue () {}

function FirebaseAdminProvider (options = {}, customFirebaseInstance) {
  let cachedProvider = null
  const firebase = customFirebaseInstance || firebaseAdmin

  if (!customFirebaseInstance) {
    if (!options.serviceAccount || !options.databaseURL) {
      throw new Error('FIREBASE: You are not passing correct options to provider')
    }

    firebase.initializeApp({
      credential: firebase.credential.cert(options.serviceAccount),
      databaseURL: options.databaseURL
    })
  }

  function createProvider () {
    return {
      verifyIdToken (token) {
        return firebase.auth().verifyIdToken(token)
      },
      createKey (path) {
        return firebase.database().ref(path).push().key
      },
      deleteUser (uid) {
        return firebase.auth().deleteUser(uid)
      },
      remove (path) {
        const ref = firebase.database().ref(path)

        return ref.remove().then(noReturnValue)
      },
      push (path, value) {
        const ref = firebase.database().ref(path).push()

        return ref.set(value).then(() => ({key: ref.key}))
      },
      set (path, value) {
        return firebase.database().ref(path).set(value).then(noReturnValue)
      },
      update (path, value) {
        return firebase.database().ref(path).update(value).then(noReturnValue)
      },
      value (path, options) {
        options = options || {}

        return new Promise((resolve, reject) => {
          Object.keys(options).reduce((currentRef, optionKey) => {
            return currentRef[optionKey](options[optionKey])
          }, firebase.database().ref(path)).once('value', (snapshot) => {
            resolve({
              key: path.split('/').pop(),
              value: snapshot.val()
            })
          }, reject)
        })
      },
      transaction (path, cb) {
        return firebase.database().ref(path).transaction(cb).then(noReturnValue)
      }
    }
  }

  return (context) => {
    context.firebase = cachedProvider = cachedProvider || createProvider()

    if (context.debugger) {
      context.debugger.wrapProvider('firebase')
    }

    return context
  }
}

export default FirebaseAdminProvider
