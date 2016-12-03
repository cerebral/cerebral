const FunctionTree = require('function-tree').default
const Devtools = require('function-tree/lib/devtools').default

const someTree = FunctionTree([])
const devtools = Devtools({
  remoteDebugger: 'localhost:8787'
})
devtools.watchExecution(someTree)

const test = someTree('somename', [
  function SomeAction({input}) {
    console.log(input);
  }
], {
  foo: 'bar2'
})
