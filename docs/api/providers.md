# Providers

Providers expose functionality to your actions, typically for handling side effects. They are a core concept in Cerebral's architecture that helps you manage interactions with external systems in a structured way.

## Creating Providers

A provider is simply an object with methods:

```js
export const myProvider = {
  doSomething() {
    return 'hello'
  },

  doSomethingAsync() {
    return fetch('/api/data').then((response) => response.json())
  }
}
```

## Using the Provider Factory

You can use the `Provider` factory from Cerebral to create providers with additional options:

```js
import { Provider } from 'cerebral'

export const myProvider = Provider({
  doSomething() {
    return 'hello'
  }
})
```

## Adding Providers to Your App

Providers are added to your application in your module definition:

```js
import * as providers from './providers'

export default {
  state: {
    // Your state
  },
  providers
}
```

## Accessing Context

Inside provider methods, you can access the full context using `this.context`:

```js
export const myProvider = {
  triggerSequenceOnEvent(event, sequencePath) {
    // Access other providers or utilities through context
    const sequence = this.context.get(sequencePath)

    window.addEventListener(event, () => {
      sequence()
    })
  },

  getDataForUser(userId) {
    // Use another provider from within your provider
    return this.context.http.get(`/api/users/${userId}`)
  }
}
```

This approach keeps the API concise while allowing providers to work together.

## Provider Options

When using the Provider factory, you can pass options to control its behavior:

```js
export const myProvider = Provider(
  {
    // Provider methods
    doSomething() {
      /* ... */
    }
  },
  {
    // Options
    wrap: false // Disable debugger wrapping for this provider
  }
)
```

### Available Options

- **wrap** (boolean): When `false`, disables debugger wrapping for this provider
- **ignoreDefinition** (boolean): When `true`, skips verification of the provider definition

## Function-Based Providers

You can also define providers as functions that receive the context and return an object:

```js
export const myDynamicProvider = (context) => {
  // Create provider based on context
  return {
    doSomething() {
      return context.state.get('someValue')
    }
  }
}
```

While this approach is more flexible, it prevents certain optimizations that are possible with object-based providers.

## Debugger Integration

By default, all provider methods are automatically tracked by Cerebral's debugger, showing method calls, arguments, and return values. This helps you understand how side effects flow through your application.

## Testing

Providers are easy to mock in tests:

```js
// Mock provider for testing
const mockHttpProvider = {
  get: jest.fn().mockResolvedValue({ result: 'mocked data' }),
  post: jest.fn().mockResolvedValue({ success: true })
}

const app = App(rootModule, {
  providers: {
    http: mockHttpProvider
  }
})
```

## Using Providers in Actions

```js
export const api = {
  getPosts() {
    return fetch('https://jsonplaceholder.typicode.com/posts').then(
      (response) => response.json()
    )
  },
  getUser(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(
      (response) => response.json()
    )
  }
}
```

```marksy
<Info>
Instead of creating a generic HTTP provider, we've built a specific API provider for JSONPlaceholder. This approach is recommended as it makes your application code more readable and focused.
</Info>
```
