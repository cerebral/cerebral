# Module

The module is how you structure your application, it holds:

```js
{
  state,
  sequences,
  reactions,
  providers,
  catch,
  modules,
}
```

You instantiate your application with a root module:

```js
const app = App({
  state: {}
})
```

And you extend this root module with nested modules:

```js
const app = App({
  state: {},
  modules: {
    moduleA,
    moduleB
  }
})
```

## Module Properties

### state

The state object contains the module's local state:

```js
{
  state: {
    users: [],
    currentUserId: null,
    isLoading: false
  }
}
```

States from child modules are merged into a single state tree.

### sequences

Sequences define the logic flows of your application:

```js
{
  sequences: {
    loadUsers: [
      set(state`isLoading`, true),
      getUsers,
      set(state`users`, props`users`),
      set(state`isLoading`, false)
    ]
  }
}
```

### reactions

Reactions let you respond to state changes:

```js
import { Reaction } from 'cerebral'

{
  reactions: {
    watchAuthentication: Reaction(
      { isAuthenticated: state`user.isAuthenticated` },
      ({ isAuthenticated, get }) => {
        if (isAuthenticated) {
          get(sequences`loadDashboard`)()
        }
      }
    )
  }
}
```

### providers

Providers expose functionality to your actions:

```js
{
  providers: {
    api: {
      getUsers() {
        return fetch('/api/users').then(res => res.json())
      }
    },
    logger: {
      log(message) {
        console.log(`[APP]: ${message}`)
      }
    }
  }
}
```

### catch

The `catch` property handles errors that occur in the module's sequences:

```js
import { ApiError, ValidationError } from './errors'

{
  catch: [
    [ApiError, sequences.handleApiError],
    [ValidationError, sequences.handleValidationError],
    [Error, sequences.handleGenericError]
  ]
}
```

Each handler is an array with:

1. The error type to catch
2. The sequence to run when that error type is caught

Errors not caught by a module will propagate to parent modules.

### modules

Child modules are registered using the `modules` property:

```js
import adminModule from './modules/admin'
import settingsModule from './modules/settings'

{
  modules: {
    admin: adminModule,
    settings: settingsModule
  }
}
```

## Creating Modules

You can define modules in two ways:

### Object Definition

```js
const myModule = {
  state: {
    isLoading: false,
    items: []
  },
  sequences: {
    loadItems: [
      set(state`isLoading`, true),
      getItems,
      set(state`items`, props`items`),
      set(state`isLoading`, false)
    ]
  }
}
```

### Factory Function

You can also create modules using a function that receives information about the module:

```js
const myModule = ({ name, path, app }) => ({
  state: {
    moduleName: name,
    modulePath: path
  },
  sequences: {
    initialize: [
      ({ store }) => {
        store.set(state`initialized`, true)
      }
    ]
  }
})
```

The module factory receives:

- `name`: The module name
- `path`: The full path to the module (e.g., "app.settings")
- `app`: Reference to the app instance

## Path Resolution

Modules create a hierarchy that affects how paths are resolved:

```js
// Root module
{
  state: { title: 'My App' },
  modules: {
    users: {
      state: { list: [] }
    }
  }
}
```

This creates a state tree:

```js
{
  title: 'My App',
  users: {
    list: []
  }
}
```

To access the users list:

```js
// In components or actions
get(state`users.list`)
```

## Module State Tag

The `moduleState` tag lets you refer to state within the current module:

```js
import { moduleState } from 'cerebral'

function toggleLoading({ store }) {
  // If in "users" module, this will toggle "users.isLoading"
  store.toggle(moduleState`isLoading`)
}
```

## Error Handling

Errors thrown in a module's sequences can be caught with the `catch` property:

```js
catch: [
  [HttpError, sequences.handleHttpError],
  [ValidationError, sequences.handleValidationError],
  [Error, sequences.handleGenericError]
]
```

If an error isn't caught by the current module, it propagates up to parent modules until handled or reaching the root module.
