# Sequences

Application development is about handling events to run side effects and produce changes to the state. Cerebral uses **sequences** to define these flows in a declarative, functional way.

## From Imperative to Declarative

Let's compare a traditional imperative approach to Cerebral's declarative sequence approach.

### Traditional Imperative Approach

```js
import { App } from 'cerebral'

const app = App({
  state: {
    title: 'My Project',
    posts: [],
    users: {},
    userModal: {
      show: false,
      id: null
    },
    isLoadingPosts: false,
    isLoadingUser: false,
    error: null
  },
  methods: {
    openPostsPage() {
      this.state.isLoadingPosts = true
      this.providers.api.getPosts().then((posts) => {
        this.state.posts = posts
        this.state.isLoadingPosts = false
      })
    },
    openUserModal(id) {
      this.state.isLoadingUser = true
      this.providers.api.getUser(id).then((user) => {
        this.state.users[id] = user
        this.state.userModal.id = id
        this.state.isLoadingUser = false
      })
    }
  },
  providers: {
    api: {
      /*...*/
    }
  }
})
```

### Cerebral's Declarative Approach

In Cerebral, we think about **what** should happen before we define **how** it happens. Let's define our sequences first:

```js
import { App } from 'cerebral'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

const app = App({
  state: {
    title: 'My Project',
    posts: [],
    users: {},
    userModal: {
      show: false,
      id: null
    },
    isLoadingPosts: false,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    openPostsPage: [
      set(state`isLoadingPosts`, true),
      getPosts,
      set(state`posts`, props`posts`),
      set(state`isLoadingPosts`, false)
    ],
    openUserModal: [
      set(state`userModal.id`, props`id`),
      set(state`userModal.show`, true),
      set(state`isLoadingUser`, true),
      getUser,
      set(state`users.${props`id`}`, props`user`),
      set(state`isLoadingUser`, false)
    ]
  },
  providers: {
    api: {
      /*...*/
    }
  }
})
```

Now we need to implement the actions used in our sequences:

```js
// Action to get posts
function getPosts({ api }) {
  return api.getPosts().then((posts) => ({ posts }))
}

// Action to get user
function getUser({ api, props }) {
  return api.getUser(props.id).then((user) => ({ user }))
}
```

## Actions

Every function in a sequence is called an **action**. Actions receive a context object with access to:

1. **store** - For changing state
2. **props** - Values passed to the sequence or from previous actions
3. **path** - When using paths for branching
4. Your custom **providers** (like the api provider in our example)

Actions can be synchronous or asynchronous:

```js
// Synchronous action
function syncAction({ store }) {
  store.set('some.path', 'some value')
}

// Asynchronous action with Promise
function asyncAction({ api }) {
  return api.getSomething().then((data) => ({ data }))
}

// Asynchronous action with async/await
async function modernAction({ api }) {
  const data = await api.getSomething()
  return { data }
}
```

## Props Flow

When a sequence triggers, you can pass it an object of props. These props are available to all actions in the sequence:

```js
// Trigger a sequence with props
app.getSequence('openUserModal')({ id: 123 })
```

When an action returns an object, its properties are merged with the existing props and passed to the next action:

```js
;[
  // Props: { id: 123 }
  function firstAction({ props }) {
    return { foo: 'bar' } // Adds to props
  },
  // Props: { id: 123, foo: 'bar' }
  function secondAction({ props }) {
    console.log(props) // { id: 123, foo: 'bar' }
  }
]
```

## Factories

Cerebral includes **factories** - functions that create actions. They help you write more concise and readable code:

```js
import { set, push, toggle, when } from 'cerebral/factories'
import { state, props } from 'cerebral'

export const mySequence = [
  // Set a value in state
  set(state`user.name`, props`name`),

  // Push to an array
  push(state`items`, props`newItem`),

  // Toggle a boolean
  toggle(state`menu.isOpen`),

  // Conditional logic
  when(state`user.isAdmin`),
  {
    true: [set(state`adminTools.visible`, true)],
    false: [set(state`adminTools.visible`, false)]
  }
]
```

```marksy
<Info>
You can also use object notation (like `state.user.name`) with the [babel-plugin-cerebral](/docs/api/proxy.html) in your project.
</Info>
```

This approach makes your sequences more declarative and easier to understand.

## Using the Debugger

You can visualize sequence execution with the Cerebral debugger. To try it out, add this to your entry file:

```js
// Get a reference to a sequence
const openPostsPage = app.getSequence('openPostsPage')

// Run it
openPostsPage()
```

When you refresh your application, you should see the sequence execution in the debugger. Experiment with the checkboxes at the top of the execution window to adjust the level of detail shown.

## Summary

Sequences provide a structured way to define your application logic by:

1. Declaring the exact flow of operations
2. Breaking down complex logic into simple actions
3. Using factories to handle common operations
4. Providing great debugging through the Cerebral debugger

In the next sections, we'll explore more advanced features like branching paths and error handling.
