---
title: The architecture
---

## The architecture

Cerebral is based on a simple concept that there are three things your application needs to function.

1. Store state
2. Render state
3. Update state

### Store state
Where to store the state of your application is a highly debated subject. Should you allow your view to store state? Should you have multiple models? Stores? Reducers? There are many concepts to handle this. In Cerebral we encourage you to store all the state of your application in a single state tree.

With this approach we get some benefits not possible with the other approaches.

#### A simple and consistent API for updating state
Typically a state update is changing out value, push an item to a list or merging an object into an other. With a single state tree we can create an API that does exactly that.

```js
state.set('foo', 'bar')
state.push('foo', 'bar')
state.merge('foo', {
  bar: 'baz'
})
```

With a single state tree we can point to paths in the tree, that is the first argument. You use dot notation to point to nested paths, like **admin.user.name**.

#### Optimized rendering
Cerebral does not look at the updates in your application as "value updates", it is "path updates". This allows Cerebral to make optimizations not possible in other frameworks.

1. There is no need for immutability in Cerebral because a change to a path means that any component depending on that path should rerender, not value comparison. In applications with large data structures immutability has a high cost

2. Since there is no value comparison in Cerebral, a change to a path does not affect the rendering of components depending on parent paths. Traditionally if you change an item in an array, also the array itself has a change. That means the component handling the array will rerender whenever an item needs to rerender. That is not the case with Cerebral

### Render state
In smaller applications it does not matter that much where you define the state of the application. It is easy to reason about the application because it is small, small enough to fit in your head. In larger application though it becomes a problem if state is defined "all over the place". Since Cerebral stores all the state of your application in one model you need a way to expose that state to your view.

In some frameworks this is done by passing the whole model or collection of models/stores from the top of your application and you have to pass it down from one component to the next. As you can imagine this becomes very tedious and fragile as all nested components completely depends on their parent. In Cerebral the state of your application can be connected at any point in the component tree.

```js
connect({
  userName: 'app.user.name'
},
  function User(props) {
    props.userName // "some name"
  }
)
```

The **connect** tells Cerebral that the component is interested in a path where the user name happens to be. When that path changes the component will render again.

### Update state
So this is where Cerebral really differs from other approaches to application development. Updating the state of your application can be everything from flipping a **true** to a **false**, to setting some state, request data from the server, depending on the status code do something with that response which might lead to new requests, you want to trigger a listener for data on the server based on the response and you want to store something in local storage. The point is... updating state can be a very complex flow. This is often where spaghetti code comes from.

To handle everything from a simple toggle to very complex flows Cerebral has a concept called signals. The signals are based on [function-tree](https://github.com/cerebral/function-tree), a project that came out of the initial experimentation of the first version of Cerebral. It allows you to compose functions together into a flow that is not only about the "happy path" or it will error. You can define many different execution paths based on whatever you want. This allows you to decouple your code, but still bring it together at a higher abstraction to understand how everything relates to each other and what order they will run in.

What makes **function-tree** especially interesting in this regard is that the debugger tracks its execution and will understand when a signal triggers, what functions are run, what state is being updated and what other side effects you might be doing.

### Summary
The architecture of Cerebral is defined to give you insight. The single model, function-tree and connecting state to your view layer all supports this vision. Creating a Cerebral application allows you and your team members to never question what actually happens when this page loads, this button is clicked etc. The decoupling of state and state updates also makes it a better experience scaling up your application as your view will be this dumb layer that only transforms state to user interface.
