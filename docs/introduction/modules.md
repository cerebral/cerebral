# Modules

Modules are the fundamental building blocks of a Cerebral application. They help you organize your application into logical units with their own state and behavior.

## Basic Module Structure

A module is an object with properties that define its behavior:

```js
import App from 'cerebral'

const app = App({
  state: {
    title: 'My Project',
    isLoading: false
  },
  sequences: {
    loadData: [
      // Actions to load data
    ]
  },
  providers: {
    // Custom functionality
  }
})
```

The most common module properties are:

- **state**: The module's local state
- **sequences**: Functions that change state and run side effects
- **providers**: Tools that actions can use
- **modules**: Child modules for further organization

## Organizing with Modules

As your application grows, you can organize it into nested modules:

```js
import App from 'cerebral'
import userModule from './modules/user'
import postsModule from './modules/posts'

const app = App({
  state: {
    title: 'My Project'
  },
  modules: {
    user: userModule,
    posts: postsModule
  }
})
```

Each module can have its own state, sequences, and providers that will be namespaced under the module's path.

## Creating a Module

Let's create a simple module for handling users:

```js
// modules/user/index.js
import * as sequences from './sequences'
import * as providers from './providers'

export default {
  state: {
    currentUser: null,
    isLoading: false,
    error: null
  },
  sequences,
  providers
}
```

```js
// modules/user/sequences.js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'
import * as actions from './actions'

export const fetchUser = [
  set(state`user.isLoading`, true),
  actions.fetchUser,
  {
    success: [
      set(state`user.currentUser`, props`user`),
      set(state`user.isLoading`, false)
    ],
    error: [
      set(state`user.error`, props`error`),
      set(state`user.isLoading`, false)
    ]
  }
]
```

## State and Path Resolution

The state from all modules is merged into one big state tree:

```js
// From root module:
{
  title: 'My Project',
  user: {
    currentUser: null,
    isLoading: false,
    error: null
  },
  posts: {
    items: [],
    isLoading: false
  }
}
```

You access state using paths:

```js
// In components
connect({
  title: state`title`,
  user: state`user.currentUser`,
  isLoadingUser: state`user.isLoading`
})

// In actions
function myAction({ store }) {
  store.set(state`user.isLoading`, true)
}
```

## Module-Relative State with moduleState

You can use `moduleState` to refer to state relative to the current module:

```js
import { moduleState } from 'cerebral'

// In a sequence in the user module:
;[
  set(moduleState`isLoading`, true), // Sets user.isLoading
  actions.fetchUser,
  set(moduleState`isLoading`, false) // Sets user.isLoading
]
```

This makes your modules more portable as they don't need to know their exact path in the state tree.

## Dynamic Modules

For more advanced organization, you can create module factories that generate the module based on its context:

```js
const userModule = ({ name, path, app }) => ({
  state: {
    users: {},
    currentPage: 1
  },
  sequences: {
    initialize: [
      ({ store }) => {
        console.log(`Module "${name}" initialized at path "${path}"`)
        store.set(moduleState`initialized`, true)
      }
    ]
  }
})
```

## Summary

Modules allow you to:

1. Organize your application into manageable pieces
2. Encapsulate related state and behavior
3. Create reusable modules that can be shared between applications
4. Scale your application as it grows in complexity

In the next sections, we'll explore other core Cerebral concepts that work with modules to help you build sophisticated applications.
