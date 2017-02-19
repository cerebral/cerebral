# Define state

Cerebral uses a single state tree to store all the state of your application. It is just a single object:

```js
{}
```

That's it.

You will normally store other objects, arrays, strings, booleans and numbers in it. Forcing you to think of your state in this simple form gives us benefits.

1. The state of the application is exposed as simple values. There are no classes or other abstractions hiding the state of your application
2. The state can be stored on the server, local storage and passed to the debugger. It is what we call **serializable** state
3. All the state of your application can be inspected through one object
4. All state is related to a path. There is no need to import and/or pass around model instances into other model instances to access state

State can be defined at the top level in the controller and/or in modules. State is defined as plain JavaScript value types. Objects, arrays, strings, numbers and booleans. This means that the state is serializable. There are no classes or other abstractions around state. This is an important choice in Cerebral that makes it possible to track changes to update the UI, store state on server/local storage and passing state information to the debugger.

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
