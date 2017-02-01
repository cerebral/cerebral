# Define State

**Load up chapter 01** - [Preview](01)

All interactive user interfaces needs **state** in one way or another. Cerebral stores this state in something we call a **state tree**. The state tree is the description of the state your application is in. Since Cerebral uses a state tree the debugger can visualize the whole state description of the application.

You might be more familiar with frameworks where state is described with classes, either multiple model classes and/or components. In Cerebral you do not put state into multiple models or components. The state is not wrapped in classes either. You have this one state tree where you insert plain values. Objects, arrays, strings, numbers and boolean.

There is no "right way" to do this, but using a single state tree and store all the state of our application in that tree gives you the ability to read, write and explore all the state of your application coherently. This approach also gives other benefits not possible with the class approach.

To define the initial state of the application all we need to do is to is add it to our **Controller** in *src/index.js*

```js
...
const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!'
  }
})
...
```

Thats it! The application should automatically reload and you will see this state in the Chrome debugger.


**Want to dive deeper?** - [Go in depth](../in_depth/state.md), or move on with the tutorial
