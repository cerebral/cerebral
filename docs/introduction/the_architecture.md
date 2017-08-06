# The architecture

## Vision
The architecture of Cerebral is driven by the goal to give you insight. The single state tree and the way state is connected to the components all support this vision. Creating a Cerebral application allows you and your team members to never question what actually happens when a page loads, a specific button is clicked, etc. Decoupling of state, components and state updates also makes it an overall better experience when scaling up an application as the components will be just a dumb layer that transforms a given state to a user interface.

The Cerebral debugger is what gives you this insight and answers your questions on what state changes and side effects has been run in any given situation. It is a powerful tool that makes it easier to reason about the application and increases productivity in planning out logic and implementation.

Cerebral is based on the simple concept of three things your application does in order to function. **Store state**, **render state** and **update state**.

## Store state
Where to store the state of an application is a highly debated subject. Should we allow the components to store state? Should we have multiple models? Stores? Reducers? Services? There are many concepts that can store state. In Cerebral you store all your state in "a single state tree". That means you do not create classes or other abstractions around state, it is all basically one big object of plain JavaScript types. Objects, arrays, strings, numbers and booleans:

```js
{
  auth: {
    isLoggedIn: false,
    user: {
      prefs: {
        style: 'light'
      },
      friends: [],
      info: {
        email: '',
        name: ''
      }
    }
  },
  posts: {
    list: [],
    selectedPostIndex: 0
  }
}
```

With this approach we get some benefits not possible with other approaches.

1. **Simple and consistent API** - Typically a state update changes a value, pushes an item in a list or merges an object into another. With a single state tree we can create an API that does exactly that:
```js
state.set('auth.user.prefs.style', 'dark')
state.push('auth.user.friends', 'Joe')
state.merge('auth.user.info', {
    email: 'cheetah@jungle.com',
    name: 'Cheetah'
})
```
With a single state tree we can point to parts of the state using paths (the first argument). We use dot notation to point to nested paths, like **auth.user.name**.

2. **Optimized rendering** - Cerebral does not look at the updates in your application as "value updates", but as "path updates". This allows Cerebral to make optimizations not possible in other frameworks:

  1. There is no need for immutability in Cerebral because a change to a path means that any component depending on that path should render (no value comparison). In applications with large data structures immutability has a high cost. There is no need to hack objects and arrays to observe changes to them either. There is nothing special about the state you put into Cerebrals state tree

  2. Since there is no value comparison in Cerebral it uses what we call **strict render**. This allows us to do render optimizations not possible with other solutions. For example you can say that a component depending on a list is only interested in added/removed items of the list or if the list itself is being replaced

3. **Visualize the entire app state** - When the state of the application is a single object we can use an object inspector to visualize the whole state of your application. With the Cerebral debugger it is easy to build a mental image of application state. You can even make changes directly to state to see how it affects the view layer.


## Render state
Since Cerebral stores all the state of the application in a single state tree we need a way to expose that state to the components. In some frameworks this is done by passing the whole model or collection of models/stores from the top of the application and down from one component to the next. This can become very tedious and fragile as all nested components completely depend on their parent. In Cerebral the state of the application is directly connected to each component, here shown with **React**:

```js
connect({
  userName: state`auth.user.info.name`
},
  function User(props) {
    props.userName // "some name" (value stored in 'app.user.name')
  }
)
```

**connect** tells Cerebral that the component is interested in a path where the user name happens to be. When that path changes the component will render. The component is now completely independent of other components. You can move it wherever you want in the component tree and it will still work.

## Update state
This is where Cerebral differs most from other approaches to application development. Updating the state of an application can be anything from:

- flipping a **true** to a **false**
- setting some value, like a filter
- reading (and storing) something in local storage
- requesting data from the server and, depending on the status code of the response, do something with that response which might lead to new requests and/or setting up a listener for data on the server
- etc...

The point is, updating state can be a very complex flow of operations. This is often where spaghetti code comes from and we use abstractions to hide it. The problem with abstractions hiding too much logic is that it becomes rigid, making it difficult to reuse logic and compose existing logic together in new ways.

To handle everything from a simple toggle to very complex operations, Cerebral has the concept of **signals**. Signals allows you to compose functions together into a flow. You can define different execution paths based on whatever you want (a status code, an error, some state, etc). This allows you to write decoupled code, while still bringing everything together in the form of a higher abstraction which helps understanding how things relate to one another (in what order they will run, when they will run, etc). Under the hood, signals are based on [function-tree](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/function-tree), a project that came out of the initial experimentations in the first version of Cerebral.
