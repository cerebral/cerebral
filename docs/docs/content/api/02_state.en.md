---
title: State
---

## State
State can be defined at the top level in the controller and/or in each module. State is defined as plain JavaScript value types. Objects, arrays, strings, numbers and booleans. This means that the state is serializable. There are no classes or other abstractions around state. This is an important choice in Cerebral that makes it possible to track changes to update the UI, store state on server/local storage and passing state information to the debugger.

```js
import {Controller} from 'cerebral'

const controller = Controller({
  state: {
    foo: 'bar',
    items: [{
      name: 'foo'
    }, {
      name: 'bar'
    }]
  }
})
```
### Special values support
When building an application you often need to keep things like files and blobs in your state for further processing. Cerebral supports these kinds of values because they will never change, or changing them can be used with existing state API. This is the list of supported types:

- **File**
- **FilesList**
- **Blob**

If you want to force Cerebral to support other types as well, you can do that with a devtools option. This is perfectly okay, but remember all state changes has to be done though the state API.

### Get state
The only way to get state in your application is by connecting it to a component or grabbing it in an action.

```js
function someAction({state}) {
  // Get all state
  const allState = state.get()
  // Get by path
  const stateAtSomePath = state.get('some.path')
  // Get computed state by passing in a computed
  const computedState = state.compute(someComputed)
}
```


### Updating state
The only way to update the state of your application is in an action. Here is a list of all possible state mutations you can do:

```js
function someAction({state}) {
  // Set or replace a value
  state.set('some.path', 'someValue')
  // Unset a key and its value
  state.unset('some.path')
  // Merge the keys and their values into existing object. Handled as a
  // change on all paths merged in
  state.merge('some.path', {
    some: 'value'
  })
  // Pushes a value to the end of the array
  state.push('some.path', 'someValue')
  // Puts the value at the beginning of the array
  state.unshift('some.path', 'someValue')
  // Removes last item in array
  state.pop('some.path')
  // Removes first item in array
  state.shift('some.path')
  // Concats passed array to existing array
  state.concat('some.path', ['someValueA', 'someValueB'])
  // Splices arrays
  state.splice('some.path', 2, 1)
}
```
