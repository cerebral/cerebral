import firebase from 'firebase'

export default function createTask (options) {
  return (name, payload = {}) => {
    return new Promise((resolve, reject) => {
      const tasksPath = options.queuePath ? options.queuePath + '/tasks' : 'queue/tasks'
      const ref = firebase.database().ref(tasksPath)
      const taskKey = ref.push(Object.assign({
        _state: options.specPrefix ? `${options.specPrefix}_${name}` : name
      }, payload))

      const taskRef = firebase.database().ref(`${tasksPath}/${taskKey.key}`)
      taskRef.on('value', data => {
        if (!data.val()) {
          taskRef.off()
          resolve()
        }
        if (data.val() && data.val()._error_details) {
          reject(data.val()._error_details)
        }
      })
    })
  }
}
