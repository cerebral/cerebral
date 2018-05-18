# State

```marksy
<Youtube url="https://www.youtube.com/embed/OIKz6iASp1A" />
```

Cerebral uses a single state tree to store all the state of your application. Even though you split up your state into modules, at the end of the day it will look like one big tree:

```js
{
  title: 'My Project',
  someOtherModule: {
    foo: 'bar'
  }
}
```

You will normally store other objects, arrays, strings, booleans and numbers in it. Forcing you to think of your state in this simple form gives us benefits.

1.  The state of the application is exposed as simple values. There are no classes or other abstractions hiding the state of your application
2.  The state can be stored on the server, local storage and passed to the debugger. It is what we call **serializable** state
3.  All the state of your application can be inspected through one object
4.  All state is related to a path. There is no need to import and/or pass around model instances into other model instances to access state

Let us add some new state to the application to show of some more Cerebral. In our **main/index.js** file:

```js
import { Module } from 'cerebral'

export default Module({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  }
})
```

We are going to load users from [JSONPlaceholder](https://jsonplaceholder.typicode.com) and for that we need some state. First of all we need a way to store the users we load. When you are dealing with data that has an _id_ you should favor inserting them into an object:

```js
{
  'user1': {
    id: 'user1',
    name: 'Bob'
  },
  'user2': {
    id: 'user2',
    name: 'Alice'
  }
}
```

This makes it easer for you to point to a specific user later on. We also need a _currentUserId_ to know which user we are currently looking at. We also want to indicate if we are currently loading a user with the _isLoadingUser_ state. Lastly we need to indicate any errors with the _error_ state.
