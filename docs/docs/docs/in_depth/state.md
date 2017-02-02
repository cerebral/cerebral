# State

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

## State in modules
When you create a new module in your application, for example...

```js
import {Controller} from 'cerebral'

const AppModule = {
  state: {
    foo: 'bar'
  }
}

const controller = Controller({
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

## Values
Using the plain value types of JavaScript gives Cerebral all its power. That said, there are times you need to store things like files or blobs. Cerebral supports this as well. The reason files are supported, but not **Date** for example, is because a date can be mutated directly. For example:

```js
const date = new Date()
date.setHours(8)
```

There is no way to keep track of these kinds of changes. Object oriented programming like this definitely makes things easier, but a functional approach opens up for new possibilities. For example...

```js
const date = Date.now()
const newDate = setHours(date, 8)
```

...allows us to pass and store the date wherever we want, because it is just a number. But do not worry about this. You can still use the Date object, or [Moment](http://momentjs.com/), in your app. It is only related to storing state you in this case use a number or a string.

And that is basically all there is to state in Cerebral. If you know about the basic JavaScript types, you know what can be stored in the Cerebral state tree :)
