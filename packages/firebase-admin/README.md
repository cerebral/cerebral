# @cerebral/firebase-admin

## install
**NPM**

`npm install @cerebral/firebase-admin@next --save --save-exact`

**YARN**

`yarn add @cerebral/firebase-admin@next --exact`

## description
The firebase admin package for function-tree allows you to easily handle Firebase Queues. With the Cerebral debugger you will even be able to merge execution data cross client/server. This package helps you set up a **QueueHandler** which registers your specs with queues and lets you know when new tasks are ready to be run.

## Provider
First you create a function tree with the Firebase provider. You will need to add the Devtools with the same port as the client to merge execution.

```js
const FunctionTree = require('function-tree').FunctionTree
const Devtools = require('function-tree/devtools')
const FirebaseProvider = require('@cerebral/firebase-admin').Provider

const devtools = Devtools({
  // Connect to same port as the client to merge execution
  remoteDebugger: 'localhost:8787'
})

const runTask = new FunctionTree([
  devtools.Provider(),
  FirebaseProvider({
    serviceAccount: {} // your service account details
    databaseURL: '', // Your database url
  })
  /* Your other providers */
])

devtools.watchExecution(runTask)

module.exports = runTask
```

### value
Get value. Outputs {key: 'theKey', value: 'theValue'}.
```js
function updateItems (context) {
  return context.firebase.value('some/path')
}
```

### transaction
Run a transaction. Outputs nothing.
```js
function updateItems (context) {
  return context.firebase.transaction('some/path', (maybeValue) => {
    if (!maybeValue) {
      return 'bar'
    }

    return context.props.data.foo
  })
}
```

### set
Set new data. Output nothing.
```js
function addItem (context) {
  return context.firebase.set(`items/${context.props.data.itemKey}`, context.props.data.item)
}
```

### push
Push new data. Outputs {key: 'keyAdded'}.
```js
function addItem (context) {
  return context.firebase.push('items', context.props.data.item)
}
```

### update
Update multiple paths from top level or at specific path. Outputs nothing.
```js
function updateItems (context) {
  return context.firebase.update({
    'items/1': context.props.data.item1Data,
    'items/2': context.props.data.item2Data
  })
}
```

```js
function updateItems (context) {
  return context.firebase.update('items', {
    '1': context.props.data.item1Data,
    '2': context.props.data.item2Data
  })
}
```

### createKey
Create a new Firebase key at some path.
```js
function authenticate (context) {
  const newKey = context.firebase.createKey('some/path')
}
```

### deleteUser
Delete a user from Firebase. Outputs nothing.
```js
function deleteProfile (context) {
  return context.firebase.deleteUser(context.props.uid)
}
```

### remove
Remove key. Outputs nothing.
```js
function removeItem (context) {
  return context.firebase.remove(`items/${context.props.itemKey}`)
}
```

## QueueHandler
The QueueHandler is responsible for registering Firebase Queues with your defined specs and what trees should run when new tasks arrive in Firebase. The QueueHandler also automatically authenticates the tasks using **verifyIdToken**.

```js
const runTask = require('./runTask')
const firebase = require('firebase-admin')
const username = require('username')
const QueueHandler = require('@cerebral/firebase-admin').QueueHandler

module.exports = new QueueHandler({
  // If you are using a specPrefix on the client during development
  // you will have to use it here as well, to pick up the correct
  // queue tasks. It is automatically removed in production
  specPrefix: username.sync(),

  // You can specify if you want to authenticate or not.
  // default is false
  authenticate: true,

  // An array of specs and corresponding trees to run
  tasks: [{
    specId: 'some_spec_name',
    numWorkers: 100,
    tree: [
      /* Some tree to run */
    ]
  }],

  // A reference in Firebase to your queue
  queueRef: firebase.database().ref('queue')
}, (specId, tree, payload) => {
  runTask.run(specId, tree, payload)
    .catch((error) => {
      // Handle error. Payload has error property with details
      runTask.run('ERROR', [/* A tree handling errors */], error.payload)
    })
});
```

When a task runs you have access to the following **props**:

```js
function someFunc (context) {
  context.props.uid // Uid of user who made the task
  context.props.data // Data passed from client
  context.props.task.resolve // Resolve the task
  context.props.task.reject // Reject the task
}
```

## TestTasks
You can easily test tasks. The TestTasks includes a local [firebase-server](https://github.com/urish/firebase-server) and allows you to define a state of your Firebase instance before running tasks and assert its state after the tasks are run.

```js
const TestTasks = require('@cerebral/firebase-admin').TestTasks

const testTasks = new TestTasks([
  /* Any mocked providers */
])

module.exports = testTasks
```

In your test framework of choice:

```js
const someTreeToRun = require('./someTreeToRun')
const test = require('./testTasks');
const assert = require('assert');

describe('example', () => {
  it('should test for foo', (done) => {
    const runTest = test.create({
      foo: 'bar'
    }, {
      // The tree to be run
      task: someTreeToRun,

      // Data to pass into tree execution
      data: {
        bip: 'bop'
      }
    }, (data) => {
      assert.equal(data.foo, 'bar')
    });

    runTest(done)
  })
})
```

Run multiple tasks:

```js
const someTreeToRun = require('./someTreeToRun')
const test = require('./testTasks');
const assert = require('assert');

describe('example', () => {
  it('should test for foo', (done) => {
    const runTest = test.create({
      foo: 'bar'
    }, [{
      task: someTreeToRun,
      data: {
        foo: 'bop'
      },
      // You can do assertions between running tasks
      assert (data) {
        assert.equal(data.foo, 'bop')
      }
    }, {
      task: someTreeToRun,
      data: {
        foo: 'bap'
      }
    }], (data) => {
      assert.equal(data.foo, 'bap')
    });

    runTest(done)
  })
})
```
