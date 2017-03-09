import firebase from 'firebase'

export default function createTask (options, executionId, functionIndex) {
  return (name, payload = {}) => {
    return new Promise((resolve, reject) => {
      const tasksPath = options.queuePath ? options.queuePath + '/tasks' : 'queue/tasks'
      const ref = firebase.database().ref(tasksPath)

      return firebase.auth().currentUser.getToken()
        .then((_token) => {
          const taskKey = ref.push(Object.assign({
            _state: options.specPrefix ? `${options.specPrefix}_${name}` : name,
            _token,
            _execution: {
              id: executionId,
              functionIndex: functionIndex
            }
          }, payload))

          const taskRef = firebase.database().ref(`${tasksPath}/${taskKey.key}`)
          taskRef.on('value', data => {
            const val = data.val()

            if (!val) {
              taskRef.off()
              resolve()
            } else if (val._error_details) {
              taskRef.off()
              reject({error: val._error_details})
            }
          })
        })
    }).catch((error) => ({error: error.message}))
  }
}
