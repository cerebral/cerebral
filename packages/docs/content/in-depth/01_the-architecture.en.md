---
title: The architecture
---

## The architecture

Cerebral is based on the simple concept of three things your application does in order to function:

1. Store state

2. Render state

3. Update state

### Store state
Where to store the state of an application is a highly debated subject. Should we allow the components to store state? Should we have multiple models? Stores? Reducers? Services? There are many concepts that can store state. In Cerebral you store all your state in "a single state tree". That means you do not create classes or other abstractions around state, it is all basically one big object of plain JavaScript types. Objects, arrays, strings, numbers and booleans:

```js
{
  auth: {
    isLoggedIn: false,
    user: {}
  },
  posts: {
    list: [],
    selectedPostIndex: 0
  }
}
```

With this approach we get some benefits not possible with other approaches.

#### A simple and consistent API for updating state
Typically a state update changes a value, pushes an item in a list or merges an object into another. With a single state tree we can create an API that does exactly that:

```js
state.set('user.prefs.style', 'dark')
state.push('user.friends', 'Joe')
state.merge('user.info', {
  email: 'cheetah@jungle.com',
  name: 'Cheetah'
})
```

With a single state tree we can point to parts of the state using paths (the first argument). We use dot notation to point to nested paths, like **auth.user.name**.

#### Optimized rendering
Cerebral does not look at the updates in your application as "value updates", but as "path updates". This allows Cerebral to make optimizations not possible in other frameworks:

1. There is no need for immutability in Cerebral because a change to a path means that any component depending on that path should render (no value comparison). In applications with large data structures immutability has a high cost. There is no need to hack objects and arrays to observe changes to them either. There is nothing special about the state you put into Cerebrals state tree

2. Since there is no value comparison in Cerebral it has a **strict render mode**. Traditionally if you change an item in an array, also the array itself has a change. This means that the component handling the array will render whenever an item needs to render. In large applications **strict render mode** will give you a lot more control of how your components should react to a state change.

### Render state
In smaller applications it does not matter that much where you define the state of the application. It is easy to reason about the application because it is small enough to fit in ones head. In larger application it becomes a problem if state is defined "all over the place".

Since Cerebral stores all the state of the application in a single state tree we need a way to expose that state to the components. In some frameworks this is done by passing the whole model or collection of models/stores from the top of the application and down from one component to the next. This can become very tedious and fragile as all nested components completely depend on their parent. In Cerebral the state of the application is directly connected to each component:

```js
connect({
  userName: 'app.user.name'
},
  function User(props) {
    props.userName // "some name" (value stored in 'app.user.name')
  }
)
```

**connect** tells Cerebral that the component is interested in a path where the user name happens to be. When that path changes the component will render. The component is now completely independent of other components. You can move it wherever you want in the component tree and it will still work.

### Update state
This is where Cerebral really differs from other approaches to application development. Updating the state of an application can be anything from:

- flipping a **true** to a **false**
- setting some value, like a filter
- reading (and storing) something in local storage
- requesting data from the server and, depending on the status code of the response, do something with that response which might lead to new requests and/or setting up a listener for data on the server
- etc...

The point is, updating state can be a very complex flow of operations. This is often where spaghetti code comes from.

To handle everything from a simple toggle to very complex operations, Cerebral has the concept of **signals**. These allow you to compose functions together into a flow that is not only about the "happy path" but properly takes the actual paths of execution into account, them being errors or other reasons to diverge execution. You can define many different execution paths based on whatever you want (a status code, an error, some state, etc). This allows you to write decoupled code, while still bringing everything together in the form of a higher abstraction which greatly helps understanding how things relate to one another (in what order they will run, when they will run, etc). Under the hood, signals are based on [function-tree](https://github.com/cerebral/function-tree), a project that came out of the initial experimentations in the first version of Cerebral.

Another powerful feature of **signals** (aka function-tree) is that there is a debugger that can track execution and understands when a signal triggers, what functions are run, what state is being updated and what other side effects are triggered.

### Summary
The architecture of Cerebral is defined to give you insight. The single state tree and the way state is connected to the components all support this vision. Creating a Cerebral application allows you and your team members to never question what actually happens when a page loads, a specific button is clicked, etc. Decoupling of state, components and state updates also makes it an overall better experience when scaling up an application as the components will be just a dumb layer that transforms a given state to a user interface.
