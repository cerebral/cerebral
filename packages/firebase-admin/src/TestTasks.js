import FunctionTree from 'function-tree'
import originalWebsocket from 'faye-websocket'
import proxyquire from 'proxyquire'
import FirebaseServer from 'firebase-server'
import FirebaseProvider from './Provider'

const firebase = proxyquire('firebase', {
  'faye-websocket': {
    Client: function (url) {
      url = url.replace(/dummy\.firebaseio\.test/i, 'localhost')

      return new originalWebsocket.Client(url)
    }
  },
  '@global': true
})
const firebaseProvider = FirebaseProvider(undefined, firebase)

function runTest (initialData, tasks, assertion, runTree, done) {
  const server = new FirebaseServer(45000, 'localhost:45000', initialData || {})
  const client = firebase.initializeApp({
    apiKey: 'someApiKey',
    databaseURL: 'ws://dummy.firebaseio.test:45000'
  })

  function abortTest (err) {
    return client.delete().then(() => {
      server.close(() => {
        done(err)
      })
    })
  }

  function resolveTest (error) {
    server.getValue().then((snapshot) => {
      client.delete().then(() => {
        server.close(() => {
          try {
            if (assertion) { assertion(snapshot) }
            done(error)
          } catch (e) { done(e) }
        })
      })
    })
  }

  function rejectTest (error) { resolveTest(error) }

  tasks.reduce((currentPromise, task, index) => {
    return currentPromise.then(() => {
      return new Promise((resolve, reject) => {
        function runTask (taskToRun) {
          runTree('task_' + index, taskToRun.task, {
            task: {
              resolve () {
                if (taskToRun.assert) {
                  server.getValue()
                    .then((snapshot) => {
                      taskToRun.assert(snapshot)
                      resolve()
                    })
                    .catch(reject)
                } else { resolve() }
              },
              reject (error) {
                reject(new Error(error))
              }
            },
            uid: taskToRun.uid,
            data: taskToRun.data
          }, (err) => {
            if (err) { abortTest(err) }
          })
        }

        if (typeof task === 'function') {
          server.getValue().then((snapshot) => {
            runTask(task(snapshot))
          })
        } else { runTask(task) }
      })
    })
  }, Promise.resolve())
    .then(() => resolveTest(null))
    .catch((error) => rejectTest(error))
}

export class TestTasks {
  constructor (providers) {
    this.providers = [firebaseProvider].concat(providers)
    this.runTree = new FunctionTree(this.providers)
  }
  create (initialData, tasks, assertion) {
    return (done) => {
      return runTest(
        initialData,
        Array.isArray(tasks) ? tasks : [tasks],
        assertion,
        this.runTree,
        done
      )
    }
  }
}
