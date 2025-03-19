# Structure

As your application grows, a consistent structure becomes essential. This guide builds on the organization concepts introduced in the [Organize guide](/docs/introduction/organize.html) and provides recommended patterns for large-scale applications.

## Recommended File Structure

```js
src/
  main/                 // Root module
    modules/            // Feature modules
      feature1/         // Each feature is its own module
      feature2/         // with the same structure
        ...
    actions.js          // Shared actions
    factories.js        // Custom action factories
    sequences.js        // Shared sequences
    providers.js        // Custom providers
    computeds.js        // Computed state values
    reactions.js        // Side effect handlers
    errors.js           // Custom error types
    index.js            // Main module definition
  controller.js         // App initialization
```

This structure organizes code primarily by type rather than by feature at the root level, with features encapsulated as modules. This approach balances cohesion and separation of concerns.

## Module Structure

Each module (including the main module and feature modules) follows the same structure pattern:

### index.js

The index file defines the module and imports all its components:

```js
import { Module } from 'cerebral'
import * as sequences from './sequences'
import * as providers from './providers'
import * as reactions from './reactions'
import * as errors from './errors'
import featureA from './modules/featureA'
import featureB from './modules/featureB'

export default Module({
  state: {
    // Module state
    isLoading: false
  },
  sequences,
  providers,
  signals: {}, // Legacy API, prefer sequences
  reactions,
  catch: [[errors.AuthError, sequences.handleAuthError]],
  modules: {
    featureA,
    featureB
  }
})
```

### actions.js

Actions are pure functions that do a specific job:

```js
// Named function style
export function setUserData({ store, props }) {
  store.set('users.current', props.user)
}

// Arrow function style
export const fetchUserData = ({ http, props }) =>
  http
    .get(`/api/users/${props.userId}`)
    .then((response) => ({ user: response.data }))
```

Group related actions in the same file. If you have many actions, consider creating subdirectories by domain:

```js
actions / auth.js // Authentication-related actions
users.js // User-related actions
posts.js // Post-related actions
```

### sequences.js

Sequences combine actions and factories to create logical flows:

```js
import { set, when } from 'cerebral/factories'
import { state, props } from 'cerebral'
import * as actions from './actions'

export const fetchUser = [
  set(state`users.isLoading`, true),
  actions.fetchUserData,
  set(state`users.current`, props`user`),
  set(state`users.isLoading`, false)
]

export const loginUser = [
  set(state`auth.isAuthenticating`, true),
  actions.authenticateUser,
  when(props`success`),
  {
    true: [set(state`auth.isLoggedIn`, true), fetchUser],
    false: [set(state`auth.error`, props`error`)]
  },
  set(state`auth.isAuthenticating`, false)
]
```

For complex applications, consider organizing sequences by feature domain similar to actions.

### factories.js

Custom factories create reusable, configurable actions:

```js
// Debounce input changes
export const debounceInput = (time) => {
  return function debounceInput({ debounce, props, path }) {
    return debounce
      .shared('inputChange', time)
      .then(path.continue)
      .catch(path.discard)
  }
}

// Mark form fields as touched
export const touchField = (field) => {
  return function touchField({ store }) {
    store.set(`form.fields.${field}.touched`, true)
  }
}
```

### providers.js

Define custom providers that expose services to your actions:

```js
export const api = {
  get(url) {
    return fetch(url).then((response) => response.json())
  },
  post(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((response) => response.json())
  }
}

export const logger = (context) => {
  context.logger = {
    info(message) {
      console.log(`[INFO] ${message}`)
    },
    error(message, error) {
      console.error(`[ERROR] ${message}`, error)
    }
  }

  return context
}
```

### reactions.js

Reactions respond to state changes with side effects:

```js
export const saveUserSettingsToLocalStorage = ({ watch, get, controller }) => {
  // Trigger when user settings change
  watch(state`user.settings.**`, () => {
    const settings = get(state`user.settings`)
    localStorage.setItem('userSettings', JSON.stringify(settings))
  })

  // Ensure reaction is triggered once during initialization
  controller.on('initialized', () => {
    const storedSettings = localStorage.getItem('userSettings')
    if (storedSettings) {
      controller.getSequence('user.initializeSettings')({
        settings: JSON.parse(storedSettings)
      })
    }
  })
}
```

### errors.js

Custom error types for better error handling:

```js
import { CerebralError } from 'cerebral'

export class AuthenticationError extends CerebralError {
  constructor(message, details) {
    super(message, details)
    this.name = 'AuthenticationError'
  }
}

export class ValidationError extends CerebralError {
  constructor(message, fields) {
    super(message, { fields })
    this.name = 'ValidationError'
  }
}
```

## Module Dependencies

Modules can access each other's state but should avoid directly calling sequences from other modules. Instead:

1. **Use sequences from parent modules** to coordinate between child modules
2. **Use state changes** to trigger reactions in other modules
3. **Pass props between sequences** to share data

```js
// Parent module sequence
export const userSelectedPost = [
  set(state`posts.currentId`, props`postId`),
  set(state`posts.showDetails`, true),
  ...when(state`users.isLoaded`),
  {
    true: [],
    false: [
      // Load user data needed by posts module
      actions.loadUsers
    ]
  }
]
```

## Scaling Tips

As your application grows:

1. **Create deeper module hierarchies** for related features
2. **Extract reusable logic** into shared modules
3. **Standardize naming conventions** for actions, sequences, etc.
4. **Document public module APIs** - which state and sequences are meant to be used by other modules
5. **Use computed props** to derive complex state rather than duplicating logic
6. **Split large files** when they exceed 300-400 lines
7. **Consider code generation** for repetitive patterns

## Example: Complete E-commerce Module

Here's an example of a complete e-commerce feature module structure:

```js
src /
  main /
  modules /
  ecommerce /
  modules /
  cart / // Shopping cart submodule
  catalog / // Product catalog submodule
  checkout / // Checkout process submodule
  actions.js // Shared e-commerce actions
sequences.js // Shared e-commerce sequences
providers.js // E-commerce specific API client
computeds.js // E-commerce derived state
errors.js // E-commerce specific errors
index.js // E-commerce module definition
```

This structure allows the e-commerce module to be self-contained while enabling interaction with other application features like authentication or user profiles.
