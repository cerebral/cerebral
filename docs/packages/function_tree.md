# function-tree

## Install
`npm install function-tree@next --save --save-exact`

## Description
Function-tree is the what Cerebral extends to create its signal implementation. Basically a function-tree allows you to execute a tree of functions. You can use the Cerebral debugger to debug function tree execution in any JS environment.

Function-tree is somewhat in the same family as Rxjs and Promises. The main difference is that Rxjs and Promises  are based on value transformation. That means only the value returned from the previous function is available in the next. This works when you indeed want to transform values, but events in your application are rarely about value transformation, they are about running side effects and going through one of multiple execution paths. Function tree embraces the fact that most of what we do in application development is running side effects.

Rxjs and Promises are also about execution control, but neither of them have declarative conditional execution paths, you have to write an *IF* or *SWITCH* statement or decouple streams. With function tree you are able to diverge the execution down paths just as declaratively as functions. This helps readability.

## API
Function-tree is implemented with ES6 imports, meaning that on Node you will have to point to the specific exports, like **default**. Examples are given with Node environment.

### instantiate

```js
const FunctionTree = require('function-tree').default

const execute = FunctionTree([
  // Providers
])

execute([
  function someFunc (context) {},
  function someOtherFunc (context) {}
], {
  foo: 'bar' // optional payload
})
```

### devtools
Download the function tree standalone debugger for [Mac](https://drive.google.com/file/d/0B1pYKovu9Upyb1Bkdm5IbkdBN3c/view?usp=sharing), [Windows](https://drive.google.com/file/d/0B1pYKovu9UpyMGRRbG45dWR6R1k/view?usp=sharing) or [Linux](https://drive.google.com/file/d/0B1pYKovu9UpyMFQ5dEdnSy1aN0E/view?usp=sharing).

```js
const FunctionTree = require('function-tree').default
const Devtools = require('function-tree/devtools').default

// Instantiate the devtools with the port
// you are running the debugger on
const devtools = Devtools({
  remoteDebugger: 'localhost:8585'
})

// Add the provider to any instantiated
// function tree you want to pass
// information from
const execute = FunctionTree([
  devtools.Provider()
])

// Watch execution of the tree
devtools.watchExecution(execute)
```

You can now use the debugger from your functions contexts and/or providers:

```js
function someFunction(context) {
  context.debugger.send({
    method: 'someMethod',
    args: ['foo', 'bar'],
    color: 'red'
  })
}
```

### sequence
You can use an array literal to define a sequence of functions.

```js
function someFunction (context) {}
function someOtherFunction (context) {}

module.exports = [
  someFunction,
  someOtherFunction
]
```

Or you can be explicit by using the **sequence** function:

```js
const sequence = require('function-tree').sequence

function someFunction (context) {}
function someOtherFunction (context) {}

module.exports = sequence([
  someFunction,
  someOtherFunction
])
```

The first argument to **sequence** can be a string, which names the sequence. This will be shown in the debugger.

```js
const sequence = require('function-tree').sequence

function someFunction (context) {}
function someOtherFunction (context) {}

module.exports = sequence('My awesome sequence', [
  someFunction,
  someOtherFunction
])
```

### parallel
```js
const parallel = require('function-tree').parallel

function someFunction (context) {}
function someOtherFunction (context) {}

module.exports = parallel([
  someFunction,
  someOtherFunction
])
```

Even though **someFunction** returns a Promise, **someOtherFunction** will be run immediately.

### context

#### props

```js
const FunctionTree = require('function-tree').default

function funcA (context) {
  context.props.foo // "bar"
}

const execute = FunctionTree()
const tree = [
  funcA
]

execute(tree, {foo: 'bar'})
```

#### path
The path is only available on the context when the function can diverge the execution down a path.

```js
const FunctionTree = require('function-tree').default

function funcA (context) {
  context.props.foo // "bar"

  return context.path.pathA({foo2: 'bar2'})
}

function funcB (context) {
  context.props.foo // "bar"
  context.props.foo2 // "bar2"

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({foo3: 'bar3'})
    }, 100)
  })
}

function funcC(context) {
  context.props.foo // "bar"
  context.props.foo2 // "bar2"
  context.props.foo3 // "bar3"
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

#### execution

##### retry
```js
function funcA (context) {
  return new Promise(resolve => {
    setTimeout(resolve, 500)
  })
}

function funcB (context) {
  if (context.props.retryCount < 3) {
    return context.execution.retry({
      retryCount: context.props.retryCount + 1
    })
  }
}

const tree = [
  funcA,
  funcB
]
```
##### abort
```js
const FunctionTree = require('function-tree').default
const execute = FunctionTree([])

function funcA (context) {
  return context.execution.abort()
}

function funcB (context) {
  // Does not run
}

const tree = [
  funcA,
  funcB
]

execute.on('abort', (functionDetails, payload) => {})

execute(tree)
```

### error
```js
const FunctionTree = require('function-tree').default
const execute = FunctionTree([])

// As an event (async)
execute.on('error', function (error, execution, payload) {

})

// As callback (sync)
execute(tree, (error, execution, payload) => {
  if (error) {
    // There is an error
  }
})
```

### provider
A provider gives you access to the current context and other information about the execution. It is required that you return the context or a mutated version of it.

```js
const FunctionTree = require('function-tree').default

function MyProvider(context, functionDetails, payload) {
  context // Current context
  context.props // Input created by the PropsProvider (default)

  payload // The current payload (Used by PropsProvider)

  functionDetails.name // Name of the function
  functionDetails.functionIndex // The index of the function in the tree, like an ID
  functionDetails.function // A reference to the running function
  functionDetails.isParallel // If the function is running in parallel with others

  context.execution.name // Function tree id
  context.execution.id // Current execution id
  context.execution.staticTree // The static representation of the tree
  context.execution.datetime // Time of execution
  context.execution.functionTree // The function tree instance

  return context // Always return the changed context
}

const execute = FunctionTree([
  MyProvider
])
```

Providers lets us do some pretty amazing things. The debugger for **function-tree** is actually just a provider that sends information to the debugger about execution and exposes an API for other providers to send their own data to the debugger.

#### ContextProvider
Will extend the context. If the debugger is active the methods on the attached object will be wrapped and debugger will notify about their uses.

```js
const FunctionTree = require('function-tree').default
const ContextProvider = require('function-tree/providers').ContextProvider
const request = require('request')

function funcA (context) {
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

execute(tree)
```

### events
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

// When a parallel execution is about to happen (array in array)
execute.on('parallelStart', (execution, payload, functionsToResolveCount) => {})

// When a function in parallel execution is done executing
execute.on('parallelProgress', (execution, payload, functionsStillResolvingCount) => {})

// When a parallel execution is done
execute.on('parallelEnd', (execution, payload, functionsExecutedCount) => {})

execute(tree)
```
