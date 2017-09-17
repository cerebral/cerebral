# State

```marksy
<Youtube url="https://www.youtube.com/embed/OIKz6iASp1A" />
```

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

To define the initial state of any application all we need to do is to add it to our **Controller** in *controller.js*


```js
import {Controller} from 'cerebral'

const controller = Controller({
  state: {
    title: 'Cerebral Tutorial'
  }
})

export default controller
```

Later you will learn about **modules** which allows you to encapsulate state with other logic.

If you want to see this in action, install the debugger and [load this BIN on Webpackbin](https://www.webpackbin.com/bins/-KpZ7xmFJK6WD44uAoUx).
