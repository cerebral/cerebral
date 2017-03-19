import firebaseAdmin from 'firebase-admin'

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
        return new Promise((resolve, reject) => {
          firebase.auth().deleteUser(uid)
            .then(() => resolve())
            .catch((error) => reject({error}))
        })
      },
      remove (path) {
        const ref = firebase.database().ref(path)

        return new Promise((resolve, reject) => {
          ref.remove()
            .then(() => resolve())
            .catch((error) => reject({error: error.message}))
        })
      },
      push (path, value) {
        const ref = firebase.database().ref(path).push()

        return new Promise((resolve, reject) => {
          ref.set(value)
            .then(() => resolve({key: ref.key}))
            .catch((error) => reject({error: error.message}))
        })
      },
      set (path, value) {
        return new Promise((resolve, reject) => {
          firebase.database().ref(path).set(value)
            .then(() => resolve())
            .catch((error) => reject({error: error.message}))
        })
      },
      update (path, value) {
        return new Promise((resolve, reject) => {
          firebase.database().ref(path).update(value)
            .then(() => resolve())
            .catch((error) => reject({error: error.message}))
        })
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
          }, (error) => reject({error: error.message}))
        })
      },
      transaction (path, cb) {
        return new Promise((resolve, reject) => {
          firebase.database().ref(path).transaction(cb)
            .then(() => resolve())
            .catch((error) => reject({error: error.message}))
        })
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
