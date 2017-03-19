import Queue from 'firebase-queue'

function authenticate ({firebase, props, path}) {
  return firebase.verifyIdToken(props.data._token)
    .then((decodedToken) => path.success({uid: decodedToken.uid}))
    .catch((error) => path.error({error}))
}

function createRunTask (task, run) {
  return (data, progress, resolve, reject) => {
    const _execution = data._execution

    delete data._execution

    run(task.specId, [
      authenticate, {
        success: task.tree,
        error: function authenticationError (context) {
          context.props.task.reject(context.props.error)
        }
      }
    ], {
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

export class TaskRunner {
  constructor (options = {}) {
    this.specPrefix = options.specPrefix || ''
    this.run = options.run || function () { throw new Error('You have to add a function tree executer as a "run" property') }
    this.tasks = options.tasks || []
    this.queueRef = options.queueRef
    this.registeredQueues = []
  }
  start () {
    this.registeredQueues = this.tasks.map((task) => {
      return new Queue(this.queueRef, {
        specId: this.specPrefix ? `${this.specPrefix}_${task.specId}` : task.specId,
        numWorkers: task.numWorkers
      }, createRunTask(task, this.run))
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
