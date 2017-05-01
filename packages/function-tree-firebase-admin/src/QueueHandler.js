import Queue from 'firebase-queue'

function authenticate ({firebase, props, path}) {
  return firebase.verifyIdToken(props.data._token)
    .then((decodedToken) => ({uid: decodedToken.uid}))
}

function createRunTask (task, shouldAuthenticate, cb) {
  return (data, progress, resolve, reject) => {
    const _execution = data._execution

    delete data._execution

    cb(task.specId, [].concat(
      shouldAuthenticate ? authenticate : []
    ).concat(task.tree), {
      _execution,
      data,
      task: {
        type: task.specId,
        resolve,
        reject
      }
    })
  }
}

export class QueueHandler {
  constructor (options = {}, cb) {
    this.specPrefix = options.specPrefix || ''
    this.shouldAuthenticate = options.authenticate
    this.cb = cb || function () { throw new Error('You have to add a callback') }
    this.tasks = options.tasks || []
    this.queueRef = options.queueRef
    this.registeredQueues = []
  }
  start () {
    this.registeredQueues = this.tasks.map((task) => {
      return new Queue(this.queueRef, {
        specId: this.specPrefix ? `${this.specPrefix}_${task.specId}` : task.specId,
        numWorkers: task.numWorkers
      }, createRunTask(task, this.shouldAuthenticate, this.cb))
    })
  }
  stop () {
    return Promise.all(this.registeredQueues.map((queue, index) => {
      return new Promise((resolve, reject) => {
        queue.shutdown().then(resolve, reject)
      })
    }))
  }
}
