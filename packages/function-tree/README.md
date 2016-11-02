# function-tree

When a function is not enough

`npm install function-tree`

### What is it?
The article [The case for function-tree](http://www.christianalfoni.com/articles/2016_09_11_The-case-for-function-tree) will give you an explanation of why it was built and how it works. Please get your wet feet with that and/or have a look at the demos and API below.

### Demo
Install the [chrome extension debugger](https://chrome.google.com/webstore/detail/function-tree-debugger/ppfbmcnapdgakfiocieggdgbhmlalgjp). Clone this repo, install deps and run:

`npm run demo:redux`

`npm run demo:mobx`

`npm run demo:node`

Please contribute with more demos, combining function tree with other projects.

### How does this differ from rxjs and promises?
Both Rxjs and Promises are about execution control, but neither of them have declarative conditional execution paths, you have to write an *IF* or *SWITCH* statement. With function tree you are able to diverge the execution down paths just as declaratively as functions. This helps readability.

Rxjs and Promises are also based on value transformation. That means only the value returned from the previous function is available in the next. This works when you indeed want to transform values, but events in your application are rarely about value transformation, they are about running side effects and going through one of multiple execution paths. And that is where **function-tree** differs. It embraces the fact that most of what we do in application development is running side effects.

### What happens when a function tree executes?
When you execute a function tree it will traverse the tree verifying its validity and analyzing the different execution paths. This gives a static representation of the tree which can be accessed by providers and can also be passed to debuggers to visualize it. The analysis is cached, so it only happens the first time. Then the tree will actually execute, creating a context for every function before running it. When the function is done running it continues to the next function.

The fact that a context is created for each function gives a lot of flexibility. You can configure your function trees to handle everything from Redux dispatchers, to firebase, mobx models, ember data, mongodb on the server etc. It does not matter, function tree is completely agnostic to this.

### Testing
Testing functions used in a function tree is as simple as just calling them and provide a context. For example:

```js
function setData(context) {
  context.window.app.data = context.input.result
}
```

The test would be:

```js
const mockedWindow = { app: {}}
setData({
  input: {result: 'foo'},
  window: mockedWindow
})

test.deepEqual(mockedWindow, {app: {data: 'foo'}})
```

When you want to test the whole function tree execution you can do:

```js
const FunctionTree = require('function-tree')
const ContextProvider = require('function-tree/providers').ContextProvider
const appMounted = require('../src/events/appMounted')

const window = {app: {}}
const execute = FunctionTree([
  ContextProvider({
    window,
    request: {
      get: Promise.resolve({status: 200, data: {foo: 'bar'}})
    }
  })
])

execute(appMounted, () => {
  test.deepEquals(window, {app: {data: 'foo'}})
})
```

The really good thing about asynchronous testing with a `function-tree` is that any async side effect returns a promise, meaning that we do not care about the side effect itself. Any async side effect can be mocked with a simple resolved or rejected promise, like you see on the **request.get** above. If you do care about the side effect though you can still insert it as normal on the context.

### API

#### Create an execution function

```js
import FunctionTree from 'function-tree'

const execute = FunctionTree([
  // Providers
])

export default execute;
```

#### Extending the context

```js
import FunctionTree from 'function-tree'
import {ContextProvider} from 'function-tree/providers'
import request from 'request'

const execute = FunctionTree([
  ContextProvider({
    request
  })
])

export default execute;
```

#### Execute a tree
By convention you should define the trees in their own file. There are no dependencies to creating a tree. It is just an array with functions.

```js
export default [
  funcA, {
    success: [
      funcB
    ],
    error: [
      funcC
    ]
  }
]
```

At the point where you actually want to execute you bring the tree and the application execute function together.

```js
import execute from './execute'
import tree from './tree'

execute(tree)
```

#### Execute group of functions
By default the function tree executes one function at a time, but you can group them, which basically means the functions will run in parallel.

```js
export default [
  funcA,
  [
    funcB, // We run
    funcC // in parallel
  ],
  funcD, {
    success: [
      funcE, // We run
      funcF, // in order
      [
        funcG, // But we run in
        funcH // parallel again
      ]
    ],
    error: []
  }
]
```

#### Passing an initial payload (input)
```js
import execute from './execute'
import tree from './tree'

execute(tree, {
  foo: 'bar'
})
```

#### Returning a payload (input)
To pass data to the other functions you need to return an object from the function synchronously or asynchronously. It needs to be an object as it will be merged with the existing input.

```js
import execute from './execute'

function funcA() {
  return {
    foo: 'bar'
  }
}

function funcB(context) {
  context.input.foo // "bar"
}

const tree = [
  funcA,
  funcB
]

execute(tree)
```

#### Running a path
The **path** is only available when there are paths to be executed.

```js
import execute from './execute'

function funcA(context) {
  return context.path.foo({
    foo: 'bar'
  })
}

function funcB(context) {
  context.input.foo // "bar"
}

const tree = [
  funcA, {
    foo: [
      funcB
    ],
    bar: []
  }
]

execute(tree)
```

#### Retry (recursive)
You can also retry execution of the tree at any point. Even with async functions running. For example:

```js
import execute from './execute'

function funcA(context) {
  return new Promise(resolve => {
    setTimeout(resolve, 500)
  })
}

function funcB(context) {
  if (context.input.retryCount < 3) {
    return context.execution.retry({
      retryCount: context.input.retryCount + 1
    })
  }
}

const tree = [
  funcA,
  funcB
]

execute(tree, {
  retryCount: 0
})
```
#### Abort
You can abort the execution of a tree by returning an abort. The abort will also trigger an `abort` event.

```js
import execute from './execute'

function funcA(context) {
  return context.execution.abort()
}

function funcB(context) {
  // Does not run
}

const tree = [
  funcA,
  funcB
]

execute.on('abort', (functionDetails, payload) => {})
execute(tree)
```

#### Catching errors
```js
// As an event (async)
execute.on('error', function (error, execution, payload) {

})

execute(tree)

// As callback (sync)
execute(tree, (error, execution, payload) => {
  if (error) {
    // There is an error
  }
})
```

#### Providers
A provider gives you access to the current context and other information about the execution. It is required that you return the context or a mutated version of it.

```js
import FunctionTree from 'function-tree'

const execute = FunctionTree([
  function MyProvider(context, functionDetails, payload) {
    context // Current context
    context.input // Input created by the InputProvider (default)
    context.result // Result created by the ResultProvider (default)

    payload // The current payload (Used by InputProvider)

    functionDetails.name // Name of the function
    functionDetails.functionIndex // The index of the function in the tree, like an ID
    functionDetails.function // A reference to the running function

    context.execution.name // Function tree id
    context.execution.id // Current execution id
    context.execution.staticTree // The static representation of the tree
    context.execution.datetime // Time of execution
    context.execution.functionTree // The function tree instance

    return context // Always return the changed context
  }
])
```

Providers lets us do some pretty amazing things. The debugger for **function-tree** is actually just a provider that sends information to the debugger about execution and exposes an API for other providers to send their own data to the debugger.

#### Input (default provider)

```js
import FunctionTree from 'function-tree'

function funcA(context) {
  context.input.foo // "bar"
}

const execute = FunctionTree()
const tree = [
  funcA
]

execute(tree, {foo: 'bar'})
```

#### Path (default provider)
The path is only available on the context when the function can diverge the execution down a path.

```js
import FunctionTree from 'function-tree'

function funcA(context) {
  context.input.foo // "bar"
  return context.path.pathA({foo2: 'bar2'})
}

function funcB(context) {
  context.input.foo // "bar"
  context.input.foo2 // "bar2"

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({foo3: 'bar3'})
    }, 100)
  })
}

function funcC(context) {
  context.input.foo // "bar"
  context.input.foo2 // "bar2"
  context.input.foo3 // "bar3"
}

const execute = FunctionTree([])
const tree = [
  funcA, {
    pathA: [
      funcB,
      funcC
    ],
    pathB: []
  }
]

execute(tree, {foo: 'bar'})
```

#### Context (optional provider)
Will extend the context. If the debugger is active the methods on the attached object will be wrapped and debugger will notify about their uses.

```js
import FunctionTree from 'function-tree'
import {ContextProvider} from 'function-tree/providers'
import request from 'request'

function funcA(context) {
  context.request
  context.request.get('/whatever') // Debugger will know about this
}

const execute = FunctionTree([
  ContextProvider({
    request
  })
])
const tree = [
  funcA
]

execute(tree, {foo: 'bar'})
```

#### Debugger (optional provider)
Download the [Chrome Extension](https://chrome.google.com/webstore/detail/function-tree-debugger/ppfbmcnapdgakfiocieggdgbhmlalgjp).

```js
import FunctionTree from 'function-tree'
import {ContextProvider, DebuggerProvider} from 'function-tree/providers'
import request from 'request'

const execute = FunctionTree([
  DebuggerProvider({
    colors: {
      request: 'red' // Set color of usage in debugger
    }
  }),
  ContextProvider({
    request
  })
])
```

When you execute trees you can name the execution:

```js
execute('thisHappened', someTree)
```

And that will be used in the debugger instead of execution id.

#### NodeDebugger (optional provider)
```js
const FunctionTree = require('function-tree')
const NodeDebuggerProvider = require('function-tree/providers/NodeDebugger')
const ContextProvider = require('function-tree/providers/Context')
const request = require('request')

const execute = FunctionTree([
  NodeDebuggerProvider({
    colors: {
      request: 'red' // Set color of usage in debugger
    }
  }),
  ContextProvider({
    request
  })
])
```

Colors supported are **red, green, yellow, blue, magenta, cyan, white, gray, bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan and bgWhite**

#### Events
The execute function is also an event emitter.

```js
import FunctionTree from 'function-tree'

const execute = FunctionTree([])
const tree = [
  funcA
]

// When an error is thrown, also catches promise errors
execute.on('error', (error, execution, payload) => {})

// When a function tree is executed
execute.on('start', (execution, payload) => {})

// When a function tree execution has ended
execute.on('end', (execution, payload) => {})

// When a function tree goes down a path
execute.on('pathStart', (execution, payload) => {})

// When a function tree ends execution of a path
execute.on('pathEnd', (execution, payload) => {})

// When a function in a function tree starts executing
execute.on('functionStart', (execution, functionDetails, payload) => {})

// When a function in a function tree stops executing
execute.on('functionEnd', (execution, functionDetails, payload) => {})

// Triggers when an async function has been run
execute.on('asyncFunction', (execution, functionDetails, payload) => {})

execute(tree)
```
