---
title: State
---

## State
State can be defined at the top level in the controller or in each module. State is defined as plain JavaScript value types. Arrays, objects, strings, numbers and booleans. This means that the state is serializable. There are not classes or other abstractions around state. This makes it easier to reason about how state is translated into user interface, it can be stored on server/local storage and the debugger can now visualize all the state of the application.

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
### Get state
The only way to get state in your application is by connecting it to a component or grabbing it in an action.

```js
function someAction({state}) {
  // Get all state
  state.get()
  // Get by path
  state.get('some.path')
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
