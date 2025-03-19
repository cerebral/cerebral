# Sequence

Sequences are the primary way to define logic flows in Cerebral. They allow you to compose actions in a declarative way.

## Basic Sequences

Sequences can be expressed with a simple array:

```js
export const mySequence = [actions.doSomething, actions.doSomethingElse]
```

You attach sequences to modules:

```js
import * as sequences from './sequences'

export default {
  sequences
}
```

## Async Actions

By default sequences run synchronously, but an action might run asynchronously, making the sequence async. When an action returns a promise, the sequence waits for it to resolve before continuing:

```js
function myAsyncAction() {
  return Promise.resolve({ result: 'data' })
}

// Or using async/await
async function myAsyncAction() {
  const data = await fetchSomething()
  return { result: data }
}

export const mySequence = [
  myAsyncAction, // Sequence will wait for this to resolve
  actions.useTheResult
]
```

## Sequence Factory

While using array literals is the simplest approach, you can also be explicit by using the sequence factory:

```js
import { sequence } from 'cerebral/factories'
import * as actions from './actions'

// Unnamed sequence
export const mySequence = sequence([actions.someAction, actions.anotherAction])

// Named sequence (useful for debugging)
export const namedSequence = sequence('My Important Flow', [
  actions.someAction,
  actions.anotherAction
])
```

## Composition

Sequences can be composed within other sequences:

```js
import * as actions from './actions'

// Define a reusable sequence
export const authenticateSequence = [
  actions.validateCredentials,
  actions.requestToken,
  actions.storeToken
]

// Use it within another sequence
export const loginSequence = [
  actions.showLoadingIndicator,
  ...authenticateSequence,
  actions.redirectToDashboard,
  actions.hideLoadingIndicator
]

// Or
export const loginSequence = [
  actions.showLoadingIndicator,
  authenticateSequence,
  actions.redirectToDashboard,
  actions.hideLoadingIndicator
]
```

## Parallel

While JavaScript is single-threaded, Cerebral can run multiple asynchronous actions concurrently using `parallel`:

```js
import { parallel } from 'cerebral/factories'
import * as actions from './actions'

export const loadDataSequence = [
  actions.setLoading,
  parallel([actions.loadUsers, actions.loadPosts, actions.loadSettings]),
  actions.unsetLoading
]

// Named parallel for debugging
export const loadDataSequence = [
  actions.setLoading,
  parallel('Load Application Data', [
    actions.loadUsers,
    actions.loadPosts,
    actions.loadSettings
  ]),
  actions.unsetLoading
]
```

The sequence continues only when all parallel actions have completed.

## Paths

Paths allow you to create branches in your sequences based on the result of an action.

### Basic Path Usage

```js
import * as actions from './actions'

export const submitForm = [
  actions.validateForm,
  {
    valid: [actions.submitForm, actions.showSuccessMessage],
    invalid: [actions.showValidationErrors]
  }
]
```

The action before the paths object decides which path to take:

```js
function validateForm({ path }) {
  const isValid = /* validation logic */

  if (isValid) {
    return path.valid()
  } else {
    return path.invalid()
  }
}
```

### Passing Data to Paths

You can pass data when taking a path:

```js
function validateForm({ path, props }) {
  if (props.form.isValid) {
    return path.valid({
      validatedData: props.form.data
    })
  } else {
    return path.invalid({
      validationErrors: getErrors(props.form)
    })
  }
}
```

### Async Path Selection

Paths work with promises too:

```js
function checkUserPermission({ api, path, props }) {
  return api
    .checkPermission(props.userId)
    .then((response) => {
      if (response.hasPermission) {
        return path.allowed({ permissions: response.permissions })
      } else {
        return path.denied({ reason: response.reason })
      }
    })
    .catch((error) => path.error({ error }))
}

export const userSequence = [
  actions.checkUserPermission,
  {
    allowed: [actions.grantAccess],
    denied: [actions.redirectToUnauthorized],
    error: [actions.showError]
  }
]
```

### Status-Based Paths

You can create paths for specific scenarios like HTTP status codes:

```js
function getUser({ http, path, props }) {
  return http
    .get(`/users/${props.id}`)
    .then((response) => path.success({ user: response.data }))
    .catch((error) => {
      if (error.status === 404) {
        return path.notFound()
      } else {
        return path.error({ error })
      }
    })
}

export const loadUser = [
  actions.getUser,
  {
    success: [actions.setUser],
    notFound: [actions.redirectToUserNotFound],
    error: [actions.showErrorMessage]
  }
]
```

### Optional Paths

Not all defined paths need to be used. Actions can choose which paths to include:

```js
// The action might take any of these paths, but isn't required to use all
export const userSequence = [
  actions.processUser,
  {
    admin: [actions.loadAdminTools],
    regular: [actions.loadRegularDashboard],
    guest: [actions.redirectToLogin],
    error: [actions.showError]
  }
]
```

### Nesting Paths

Paths can be nested to create complex conditional flows:

```js
export const checkoutSequence = [
  actions.validateCart,
  {
    valid: [
      actions.processPayment,
      {
        success: [actions.createOrder, actions.showReceipt],
        declined: [actions.showPaymentError],
        error: [actions.logPaymentError]
      }
    ],
    invalid: [actions.showCartError]
  }
]
```

## Running Sequences

There are several ways to run sequences:

```js
import { sequences, state } from 'cerebral'

// From an action
function myAction({ get, props }) {
  // Get a sequence and run it
  const mySequence = get(sequences`mySequence`)
  mySequence({ someData: props.data })
}

// From a component
connect(
  {
    buttonClicked: sequences`mySequence`
  },
  ({ buttonClicked }) => {
    return <button onClick={() => buttonClicked({ id: 123 })}>Click me</button>
  }
)

// From a reaction
Reaction(
  {
    isLoggedIn: state`user.isLoggedIn`
  },
  ({ isLoggedIn, get }) => {
    if (isLoggedIn) {
      get(sequences`loadDashboard`)()
    }
  }
)
```

```marksy
<Info>
You can also use object notation (like `sequences.mySequence`) with the [babel-plugin-cerebral](/docs/api/proxy.html).
</Info>
```
