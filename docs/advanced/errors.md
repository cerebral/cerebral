# Error Handling

Cerebral provides a structured approach to error handling through the `catch` property of modules. This allows you to handle errors without cluttering your sequences with try/catch patterns.

## Basic Error Handling

Instead of creating nested structures for error handling, you can use the `catch` property to handle errors in a cleaner way:

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then((user) => ({ user }))

export default {
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      set(state`isLoadingUser`, true),
      getUser,
      set(state`users.${props`id`}`, props`user`),
      set(state`currentUserId`, props`id`),
      set(state`isLoadingUser`, false)
    ]
  },
  catch: [[Error, set(state`error`, props`error.message`)]]
}
```

The `catch` property takes an array of error handlers. Each handler is an array with two elements:

1. The error type to catch
2. The sequence to run when the error is caught

```marksy
<Warning>
Notice that the catch handler is an array of arrays. Each item in the array is an array of two items. The type of error to handle and what sequence should handle it.
</Warning>
```

## Custom Error Types

Creating custom error types gives you more control over error handling. This allows you to catch specific errors in different ways:

```js
import { CerebralError } from 'cerebral'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

// Create a custom error type
export class JsonPlaceholderError extends CerebralError {
  constructor(message, statusCode) {
    super(message)
    this.name = 'JsonPlaceholderError'
    this.statusCode = statusCode
  }
}

export default {
  // ...module definition
  catch: [[JsonPlaceholderError, set(state`error`, props`error.message`)]]
}
```

## Throwing Custom Errors

You can throw custom errors from actions or providers:

```js
import { Provider } from 'cerebral'
import { JsonPlaceholderError } from './errors'

export const jsonPlaceholder = Provider({
  getUser(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          return response.text().then((message) => {
            throw new JsonPlaceholderError(message, response.status)
          })
        }
      })
      .then((user) => ({ user }))
      .catch((error) => {
        throw new JsonPlaceholderError(error.message, 0)
      })
  }
})
```

## Error Handler Sequences

For better organization, create dedicated sequences for error handling:

```js
// sequences.js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

export const handleError = [
  set(state`error`, props`error.message`),
  set(state`isLoadingUser`, false)
]

export const loadUser = [
  // ...loadUser sequence
]

// In your module
export default {
  // ...module definition
  catch: [[JsonPlaceholderError, sequences.handleError]]
}
```

## Error Debugging

By default, Cerebral will show caught errors in the debugger but won't throw them to the console. You can change this behavior with the `throwToConsole` option:

```js
import App from 'cerebral'
import main from './main'
import Devtools from 'cerebral/devtools'

const app = App(main, {
  throwToConsole: true, // Also log caught errors to console
  devtools: Devtools({
    host: 'localhost:8585'
  })
})
```

## Error Propagation

Errors propagate up the module hierarchy. If a module doesn't have a matching error handler, the error will bubble up to its parent module, and so on until it reaches the root module.

This allows you to:

- Handle common errors at the root level
- Handle specific errors close to where they occur
- Create specialized error handling for different parts of your application
