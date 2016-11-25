---
title: State
---

## State

Cerebral uses a single state tree to store all the state of your application. It is just a single object:

```js
{}
```

Thats it.

You can only store other objects, arrays, strings, booleans and numbers in it. Forcing you to think of your state in this simple form gives us benefits.

1. The state of the application is exposed as simple values. There are no classes or other abstractions hiding the state of your application

2. The state can be stored on the server, local storage and passed to the debugger. It is what we call **serializable** state

3. All the state of your application can be inspected through one object

When you create a new module in your application, for example...

```js
import {Controller} from 'cerebral'

const AppModule = {
  state: {
    foo: 'bar'
  }
}

const conroller = Controller({
  modules: {
    app: AppModule
  }
})
```

... Cerebral will put this into the single state tree as:

```js
{
  app: {
    foo: 'bar'
  }
}
```

You can now point to this state with a path: **"app.foo"**. To handle large amounts of state you simply namespace it by putting the state into a module.

And that is basically all there is to state in Cerebral. If you know how to use work with basic JavaScript types, you can work with state in Cerebral.
