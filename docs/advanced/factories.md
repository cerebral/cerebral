# Custom Factories

## What is a Factory?

In Cerebral, factories are functions that create actions. This pattern gives you power to create reusable, configurable actions:

```js
function createAction(config) {
  return function action(context) {
    // Use config and context here
  }
}
```

## Why Use Factories?

Factories help you:

- Reuse similar logic with different configurations
- Make your sequences more declarative and readable
- Configure actions before they run

## Basic Factory Example

Here's a simple factory that creates a message:

```js
function createMessager(name) {
  function message({ store }) {
    store.set('message', `Hello ${name}!`)
  }
  return message
}

// Use it in a sequence
export const sayHello = [
  createMessager('Bob')
  // Result: sets state.message to "Hello Bob!"
]
```

## Creating HTTP Request Factories

One common use case is creating factories for API requests:

```js
function httpGetFactory(url) {
  function httpGetAction({ http, props }) {
    return http.get(url).then((response) => ({ response: response.data }))
  }
  return httpGetAction
}

// Usage
export const getUsers = [
  httpGetFactory('/api/users'),
  set(state`users`, props`response`)
]
```

## Using Dynamic Values with Tags

Let's improve our factory to handle dynamic values using Cerebral's tag system:

```js
import { string, props } from 'cerebral'

function httpGetFactory(url) {
  function httpGetAction({ http, get }) {
    // Resolve the URL if it's a tag
    const resolvedUrl = get(url)
    return http
      .get(resolvedUrl)
      .then((response) => ({ response: response.data }))
  }
  return httpGetAction
}

// Usage with dynamic URL
export const getUser = [
  httpGetFactory(string`/api/users/${props`userId`}`),
  set(state`currentUser`, props`response`)
]
```

## Supporting Path Divergence

Factories can support branching execution paths:

```js
function httpGetFactory(url) {
  function httpGetAction({ http, get, path }) {
    const resolvedUrl = get(url)

    // Check if this action is used with paths
    if (path) {
      return http
        .get(resolvedUrl)
        .then((response) => path.success({ response: response.data }))
        .catch((error) => path.error({ error: error.response }))
    } else {
      // Regular promise return when not using paths
      return http
        .get(resolvedUrl)
        .then((response) => ({ response: response.data }))
    }
  }
  return httpGetAction
}

// Usage with paths
export const getUsers = [
  httpGetFactory('/api/users'),
  {
    success: set(state`users`, props`response`),
    error: set(state`error`, props`error`)
  }
]
```

## Status-Based Path Selection

You can enhance factories to choose paths based on status codes:

```js
function httpGetFactory(url) {
  function httpGetAction({ http, get, path }) {
    const resolvedUrl = get(url)

    if (path) {
      return http
        .get(resolvedUrl)
        .then((response) => {
          // Choose path based on status code or use default success
          return path[response.status]
            ? path[response.status]({ response: response.data })
            : path.success({ response: response.data })
        })
        .catch((error) => {
          return path[error.response?.status]
            ? path[error.response?.status]({ error: error.response })
            : path.error({ error: error.response })
        })
    } else {
      // Regular promise return
      return http
        .get(resolvedUrl)
        .then((response) => ({ response: response.data }))
    }
  }
  return httpGetAction
}

// Usage with status paths
export const getUsers = [
  httpGetFactory('/api/users'),
  {
    success: set(state`users`, props`response`),
    404: set(state`error`, 'Users not found'),
    error: set(state`error`, props`error.message`)
  }
]
```

## Working with Tag Paths

Sometimes you need to resolve not just the value of a tag, but its path:

```js
function setFactory(target, value) {
  function setAction({ store, resolve }) {
    // Check if target is a state tag
    if (resolve.isTag(target, 'state')) {
      // Get the path from the tag (e.g., "users.list")
      const path = resolve.path(target)
      // Get the value to set, which might also be a tag
      const resolvedValue = resolve.value(value)

      // Update state at the resolved path
      store.set(path, resolvedValue)
    } else {
      throw new Error('Target must be a state tag')
    }
  }
  return setAction
}

// Usage
export const updateUser = [
  setFactory(state`users.${props`userId`}`, props`userData`)
]
```

## Simple Factory Examples

Here are some useful custom factories you can create:

```js
// Notification factory
function notifyFactory(message) {
  return function notify({ store, get }) {
    store.set('notifications.message', get(message))
    store.set('notifications.visible', true)
  }
}

// Timeout factory
function delayFactory(ms) {
  return function delay() {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Usage
export const showNotification = [
  notifyFactory('Operation successful!'),
  delayFactory(3000),
  set(state`notifications.visible`, false)
]
```

## Best Practices

1. **Name your actions**: Give the returned function a name for better debugging
2. **Keep factories focused**: Each factory should do one thing well
3. **Handle errors**: Always consider how errors will be handled
4. **Document parameters**: Make it clear what each factory expects
5. **Use tag resolution**: Take advantage of Cerebral's tag system for dynamic values

Custom factories are a powerful way to create reusable logic in your Cerebral application while keeping your sequences clean and declarative.
