# State

## Get state

The only way to get state in your application is by connecting it to a component or grabbing it in an action.

```js
import { state, moduleState } from 'cerebral'

function someAction({ get }) {
  const stateAtSomePath = get(state.some.path)
  // Get from module running this execution
  const stateAtModulePath = get(moduleState.isLoading)
}
```

## Updating state

The only way to update the state of your application is in an action. Here is a list of all possible state mutations you can do:

```js
function someAction({ store }) {
  // Concats passed array to existing array
  store.concat(state.some.path, ['someValueA', 'someValueB'])
  // Increment value at given path (default increment is 1)
  store.increment(state.some.path, 1)
  // Merge the keys and their values into existing object. Handled as a
  // change on all paths merged in
  store.merge(state.some.path, {
    some: 'value'
  })
  // Removes last item in array
  store.pop(state.some.path)
  // Pushes a value to the end of the array
  store.push(state.some.path, 'someValue')
  // Set or replace a value
  store.set(state.some.path, 'someValue')
  // Removes first item in array
  store.shift(state.some.path)
  // Splices arrays
  store.splice(state.some.path, 2, 1)
  // Toggle a boolean value
  store.toggle(state.some.path)
  // Unset a key and its value
  store.unset(state.some.path)
  // Puts the value at the beginning of the array
  store.unshift(state.some.path, 'someValue')

  // Module has the same API surface, though the path is relative
  // to the module path running this action
  store.set(moduleState.foo, 'bar')
}
```

**NOTE!** You should not extract state and change it directly in your actions or components. This will not be tracked by Cerebral. That means a render will not be triggered and the debugger will not know about it. Treat your state as if it was immutable and only change it using the **store API**.

## Special values support

When building an application you often need to keep things like files and blobs in your state for further processing. Cerebral supports these kinds of values because they will never change, or changing them can be used with existing store API. This is the list of supported types:

* **File**
* **FilesList**
* **Blob**
* **ImageData**
* **RegExp**

If you want to force Cerebral to support other types as well, you can do that with a devtools option. This is perfectly okay, but remember all state changes has to be done through the store API.
