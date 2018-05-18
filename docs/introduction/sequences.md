# Sequences

```marksy
<Youtube url="https://www.youtube.com/embed/o2ULoHp22BE" />
```

Application development is about handling events to produce changes to the state. This event is everything from a button click to a url change. It can be a user interaction or some other internal event in the application. There are many concepts for handling events, like handlers, actions, dispatching etc. In Cerebral you handle events using a **sequence**.

We are now going to define a sequence that we will trigger manually. This signal should receive an id of a user, go grab that user and store it as the current user in your application.

When you build Cerebral application you typically write out the sequences first, then you implement the actions. Let us try that approach now. What we want to happen is:

1.  Set that we are loading a user
2.  Go grab the user
3.  Add the user
4.  Set current user
5.  Unset that we are loading a user

Let us create a **sequences.js** file in `src/main` and export a sequence:

```js
import * as actions from './actions'

export const loadUser = [
  actions.setLoadingUser,
  actions.getUser,
  actions.addUser,
  actions.setCurrentUser,
  actions.unsetLoadingUser
]
```

As you can see we can just write out exactly what we want to happen. This allows us to reason about **what** we want our application to do before we think about **how** to do it.

```marksy
<Info>
When a sequence triggers you can pass in **props**. These props can be accessed by any action
in the sequence. In this example the props would contain the id of the user we want to fetch.
</Info>
```

Let us create the **actions.js** file in `src/main` and look at how we implement the actions.

```js
import { state } from 'cerebral/proxy'

export const setLoadingUser = ({ operators }) =>
  operators.set(state.isLoadingUser, true)

export const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id)

export const addUser = ({ operators, props }) =>
  operators.set(state.users[props.id], props.user)

export const setCurrentUser = ({ operators, props }) =>
  operators.set(state.currentUserId, props.id)

export const unsetLoadingUser = ({ operators }) =>
  operators.set(state.isLoadingUser, false)
```

Your first question here is probably: *"What is this state proxy?"*. Cerebral exposes what we call proxies. They basically allows you to point to state, sequences etc. and based on the context Cerebral is able to evaluate what you want to do. There are several benefits to this:

1. We have to track the state changes that is being performed to effectively notify the view layer about needed changes. There are several approaches to this where Cerebral uses its own approach called "path matching". Proxies allows us to avoid using strings to define these paths

2. We improve the declarativeness of the code, as dot notation reads better than a string when you compose multiple values together, for example `state.users[props.id]`

3. Proxies allows us to type state, sequences and computed using TypeScript... if you want

Moving on... as you can see every action has access to **operators**, **props** and **jsonPlaceholder**. The operators API allows you to do different changes on the state of the application, here only showing *set*. The props holds values passed into the sequence and populated through the execution. When **jsonPlaceholder.getUser** runs it will return an object with the user which will extend the props to:

```js
{
  // We pass the id when we execute the signal
  id: 1,

  // jsonPlaceholder.getUser will extend the
  // props with the user
  user: {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    ...
  }
}
```

And now this is available to the next action in line. Let us visualize this:

```js
import * as actions from './actions'

export const loadUser = [
  actions.setLoadingUser, // { id }
  actions.getUser, // { id }
  actions.addUser, // { id, user }
  actions.setCurrentUser, // { id, user }
  actions.unsetLoadingUser // { id, user }
]
```

Let us fire up the signal and we can rather let the debugger do this visualization for us. First we have to actually define the signal in our `src/main/index.js` file:

```js
import { Module } from 'cerebral'
import * as providers from './providers'
import * as sequences from './sequences'

export default Module({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences,
  providers
})
```

Then in `/src/index.js` add the following:

```js
import App from 'cerebral'
import main from './main'

let Devtools = null
if (process.env.NODE_ENV === 'development') {
  Devtools = require('cerebral/devtools').default
}

const app = App(main, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})

const loadUser = app.getSequence('loadUser')

loadUser({
  id: 1
})
```

When you refresh the application now you should see the debugger show you that the *loadUser* sequence has triggered. Play around with the checkboxes at the top of the execution window in the debugger to adjust the level of detail.

## Factories

But we can actually refactor our *loadUser* sequence a bit. A concept in functional programming called *factories* allows you to create a function by calling a function. What we want to create are functions that changes the state of the application. In the **sequences.js** file do:

```js
import * as actions from './actions'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'

export const loadUser = [
  set(state.isLoadingUser, true),
  actions.getUser,
  set(state.users[props.id], props.user),
  set(state.currentUserId, props.id),
  set(state.isLoadingUser, false)
]
```

We now just made 4 actions obsolete. There are several other factories for operators and also managing the flow of execution.

```marksy
<Info>
If you have built Cerebral applications on previous versions you know the concept "template literal tags". You can still use these instead, but the proxies are more declarative. The babel plugin actually converts the proxies to tags.
</Info>
```

## Paths

Our *actions.getUser* might fail. The server might be unavailable for example. One way to solve this is to use conditional logic in the sequence. Let us first express a conditional in the sequence of **success** and **error**:

```js
import * as actions from './actions'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'

export const loadUser = [
  set(state.isLoadingUser, true),
  actions.getUser,
  {
    success: [],
    error: []
  },
  set(state.users[props.id], props.user),
  set(state.currentUserId, props.id),
  set(state.isLoadingUser, false)
]
```

Objects in sequences are treated as conditional execution and it is the action in front of it, *actions.getUser* in this case, that chooses what path of execution to take. Since we only want to set the user on a success, let us refactor a bit:

```js
import * as actions from './actions'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'

export const loadUser = [
  set(state.isLoadingUser, true),
  actions.getUser,
  {
    success: [
      set(state.users[props.id], props.user),
      set(state.currentUserId, props.id)
    ],
    error: set(state.error, props.error.message)
  },
  set(state.isLoadingUser, false)
]
```

```marksy
<Info>
In this case we just chose to use **success** and **error** as paths here, but it could have been anything. You could even create paths for http error codes if you wanted to, specifically handling 404 for a user not found for example.
</Info>
```

To actually handle the conditional execution we need to look back into our *getUser* action located in **actions.js**:

```js
export const getUser = ({ jsonPlaceholder, props, path }) =>
  jsonPlaceholder
    .getUser(props.id)
    .then((result) => path.success(result))
    .catch((error) => path.error({ error }))
```

The **result** here is the object with the user which we use as an argument when calling the success path. When we catch an **error** we want to return an object with the error, which will be merged into the props of the signal.

```marksy
<Warning>
When we call a path we return its result from the action. That means if you want an action to run down a path you have to call the path to execute and return its value. Just calling the path does nothing.
</Warning>
```
