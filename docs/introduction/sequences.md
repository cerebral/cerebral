# Sequences

```marksy
<Youtube url="https://www.youtube.com/embed/o2ULoHp22BE" />
```

Application development is about handling events to run side effects and produce changes to the state. This event can be anything from a user interaction or some other internal event in the application.

We are now going to define a piece of logic to execute. It should receive an id of a user, go grab that user and store it as the current user in your application. Let us see how you traditionally expect this logic to work:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'

const app = App({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  methods: {
    loadUser(id) {
      this.state.isLoadingUser = true
      this.providers.getUser(id)
        .then((user) => {
          this.state.users[id] = user
          this.state.currentUserId = id
          this.state.isLoadingUser = true
        })
    }
  },
  providers: {...}  
}, {...})
```

This is an **imperative** approach to managing application logic, using methods. In Cerebral we do not use an imperative approach, but a functional one. That means instead of methods we use **sequences**. Let us review what we want to happen before we dive into it:

1.  Set that we are loading a user
2.  Go grab the user
3.  Add the user
4.  Set current user
5.  Unset that we are loading a user

We can mock out this **sequence** in our main module:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'

const app = App({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      setLoadingUser,
      getUser,
      addUser,
      setCurrentUser,
      unsetLoadingUser
    ]
  },
  providers: {...}  
}, {...})
```

As you can see we can just write out exactly what we want to happen. This allows us to reason about **what** we want our application to do before we think about **how** to do it.

```marksy
<Info>
When a sequence triggers you can pass in **props**. These props can be accessed by any function
in the sequence. In this example the props would contain the id of the user we want to fetch.
</Info>
```

We are now going to do the actual implementation:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'
import { state } from 'cerebral/proxy'

const setLoadingUser = ({ store }) =>
  store.set(state.isLoadingUser, true)

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

const addUser = ({ store, props }) =>
  store.set(state.users[props.id], props.user)

const setCurrentUser = ({ store, props }) =>
  store.set(state.currentUserId, props.id)

const unsetLoadingUser = ({ store }) =>
  store.set(state.isLoadingUser, false)

const app = App({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      setLoadingUser,
      getUser,
      addUser,
      setCurrentUser,
      unsetLoadingUser
    ]
  },
  providers: {...}  
}, {...})
```

Your first question here is probably: *"What is this state proxy?"*. Cerebral exposes what we call proxies. They basically allows you to point to state, sequences etc. and based on the context Cerebral is able to evaluate what you want to do. The **state** proxy points to the main module of the application, the root state.

## Actions

As you can see every function run in the sequence has access to **store**, **props** and our own **jsonPlaceholder** is available as well. We call these functions **actions** and Cerebral builds a context for them when they run. This context is passed in as the only argument. This context is where the store API allows you to do different changes on the state of the application. The props holds values passed into the sequence and populated through the execution.

When **jsonPlaceholder.getUser** runs we use its returned user and return an object with that user:

```js
[
  setLoadingUser, // { id }
  getUser, // { id }
  addUser, // { id, user }
  setCurrentUser, // { id, user }
  unsetLoadingUser // { id, user }
]
```

Let us fire up the sequence and we can rather let the debugger do this visualization for us. In the `/src/index.js` add the following:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'
import { state } from 'cerebral/proxy'

const setLoadingUser = ({ store }) =>
  store.set(state.isLoadingUser, true)

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

const addUser = ({ store, props }) =>
  store.set(state.users[props.id], props.user)

const setCurrentUser = ({ store, props }) =>
  store.set(state.currentUserId, props.id)

const unsetLoadingUser = ({ store }) =>
  store.set(state.isLoadingUser, false)

const app = App({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      setLoadingUser,
      getUser,
      addUser,
      setCurrentUser,
      unsetLoadingUser
    ]
  },
  providers: {...}  
}, {...})

const loadUser = app.getSequence('loadUser')

loadUser({
  id: 1
})
```

When you refresh the application now you should see the debugger show you that the *loadUser* sequence has triggered. Play around with the checkboxes at the top of the execution window in the debugger to adjust the level of detail.

## Factories

But we can actually refactor our *loadUser* sequence a bit. A concept in functional programming called *factories* allows you to create a function by calling a function. What we want to create are functions that changes the state of the application. Refactor your code like this:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

const app = App({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      set(state.isLoadingUser, true),
      getUser,
      set(state.users[props.id], props.user),
      set(state.currentUserId, props.id),
      set(state.isLoadingUser, false)
    ]
  },
  providers: {...}  
}, {...})

const loadUser = app.getSequence('loadUser')

loadUser({
  id: 1
})
```

We now just made 4 actions obsolete. There are several other factories for store and also managing the flow of execution.

```marksy
<Info>
If you have built Cerebral applications on previous versions you know the concept "template literal tags". You can still use these instead, but the proxies are more declarative. The babel plugin actually converts the proxies to tags.
</Info>
```