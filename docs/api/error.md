# Error

The `CerebralError` class allows you to create custom error types that integrate with Cerebral's error handling system. Custom errors can be caught specifically in the module's `catch` configuration.

## Creating Custom Errors

Extend the `CerebralError` class to create custom error types:

```js
import { CerebralError } from 'cerebral'

export class AuthenticationError extends CerebralError {
  constructor(message, details) {
    super(message, details)
    this.name = 'AuthenticationError' // Override the default name
  }
}

// With additional properties
export class ApiError extends CerebralError {
  constructor(message, statusCode, responseData) {
    super(message, { responseData }) // Details passed to parent
    this.name = 'ApiError'
    this.statusCode = statusCode // Custom property
  }
}
```

## Error Properties

The `CerebralError` includes these properties:

- `name`: Error type name, defaults to 'CerebralError' (should be overridden)
- `message`: The error message
- `details`: Optional object with additional error details
- `stack`: Stack trace (automatically generated)

## Throwing Errors

Throw custom errors in actions or providers:

```js
import { AuthenticationError } from './errors'

function authenticate({ props }) {
  if (!props.token) {
    throw new AuthenticationError('Invalid token', {
      attempted: true,
      userId: props.userId
    })
  }

  // Continue with authentication
}
```

## Catching Errors

Errors are caught in the module's `catch` configuration:

```js
import { AuthenticationError, ApiError } from './errors'
import * as sequences from './sequences'

export default {
  // ...module definition
  catch: [
    // Catch specific error types
    [AuthenticationError, sequences.handleAuthError],
    [ApiError, sequences.handleApiError],

    // Generic fallback (catches any Error)
    [Error, sequences.handleGenericError]
  ]
}
```

## Error Handling Propagation

```marksy
<Info>
If a module doesn't catch an error, it propagates up to parent modules until caught or reaching the root. This enables centralized error handling for common errors while allowing specialized handling in specific modules.
</Info>
```

## Serialization

`CerebralError` instances can be serialized to JSON, which includes all properties except 'toJSON', 'execution', and 'functionDetails':

```js
try {
  throw new ApiError('Failed to fetch data', 404, { error: 'Not found' })
} catch (error) {
  console.log(JSON.stringify(error))
  // Output includes: name, message, details, statusCode, stack
}
```
