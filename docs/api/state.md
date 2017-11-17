# State

## Get state
The only way to get state in your application is by connecting it to a component or grabbing it in an action.

```js
function someAction({ state, module }) {
  // Get all state
  const allState = state.get()
  // Get by path
  const stateAtSomePath = state.get('some.path')
  // Get from module running this signal
  const moduleState = module.get('isLoading')
}
```


## Updating state
The only way to update the state of your application is in an action. Here is a list of all possible state mutations you can do:

```js
function someAction({ state, module }) {
  // Concats passed array to existing array
  state.concat('some.path', ['someValueA', 'someValueB'])
  // Increment value at given path (default increment is 1)
  state.increment('some.path', 1)
  // Merge the keys and their values into existing object. Handled as a
  // change on all paths merged in
  state.merge('some.path', {
    some: 'value'
  })
  // Removes last item in array
  state.pop('some.path')
  // Pushes a value to the end of the array
  state.push('some.path', 'someValue')
  // Set or replace a value
  state.set('some.path', 'someValue')
  // Removes first item in array
  state.shift('some.path')
  // Splices arrays
  state.splice('some.path', 2, 1)
  // Toggle a boolean value
  state.toggle('some.path')
  // Unset a key and its value
  state.unset('some.path')
  // Puts the value at the beginning of the array
  state.unshift('some.path', 'someValue')

  // Module has the same API surface, though the path is relative
  // to the module path running this action
  module.set('foo', 'bar')
}
```

**NOTE!** You should not extract state and change it directly in your actions or components. This will not be tracked by Cerebral. That means a render will not be triggered and the debugger will not know about it. Treat your state as if it was immutable and only change it using the **state API**.

## Special values support
When building an application you often need to keep things like files and blobs in your state for further processing. Cerebral supports these kinds of values because they will never change, or changing them can be used with existing state API. This is the list of supported types:

- **File**
- **FilesList**
- **Blob**
- **ImageData**
- **RegExp**

If you want to force Cerebral to support other types as well, you can do that with a devtools option. This is perfectly okay, but remember all state changes has to be done through the state API.
