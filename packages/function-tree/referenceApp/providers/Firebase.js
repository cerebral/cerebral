const firebase = require('firebase')

function FirebaseProvider () {
  return (context) => {
    context.firebase = {
      push (path, value) {
        const ref = firebase.database().ref(path).push()

        context.debugger && context.debugger.send({
          method: 'firebase.push',
          color: 'green',
          args: [path, value]
        })
        return ref.set(value)
          .then(() => ({}))
          .catch((error) => ({error: error.message}))
      },
      set (path, value) {
        context.debugger && context.debugger.send({
          method: 'firebase.set',
          color: 'green',
          args: [path, value]
        })
        return firebase.database().ref(path).set(value)
          .then(() => ({}))
          .catch((error) => ({error: error.message}))
      },
      update (path, value) {
        context.debugger && context.debugger.send({
          method: 'firebase.update',
          color: 'green',
          args: [path, value]
        })
        return firebase.database().ref(path).update(value)
          .then(() => ({}))
          .catch((error) => ({error: error.message}))
      },
      value (path, options) {
        context.debugger && context.debugger.send({
          method: 'firebase.value',
          color: 'green',
          args: [path, options]
        })
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
        context.debugger && context.debugger.send({
          method: 'firebase.transaction',
          color: 'green',
          args: [path]
        })

        return firebase.database().ref(path).transaction(cb)
          .then(() => ({}))
          .catch((error) => ({error: error.message}))
      }
    }

    return context
  }
}

module.exports = FirebaseProvider
