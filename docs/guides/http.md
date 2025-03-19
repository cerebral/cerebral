# HTTP Requests in Cerebral

Most applications need to make HTTP requests to a server. Cerebral provides a flexible approach where you create custom providers using your preferred HTTP library. This gives you complete control over how HTTP requests are handled in your application.

## Creating an HTTP Provider

### Using Axios

[Axios](https://github.com/axios/axios) is a popular HTTP client that works in both browser and Node.js environments.

```js
import axios from 'axios'

export const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete
}
```

This simple implementation exposes the axios methods directly. You can register it in your module:

```js
import * as providers from './providers'

export default {
  // ...module definition
  providers
}
```

### Using Fetch API

The native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is available in all modern browsers and Node.js:

```js
export const http = {
  async get(url, options = {}) {
    const response = await fetch(url, {
      method: 'GET',
      ...options
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    return response.json()
  },

  async post(url, data, options = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    return response.json()
  }

  // Add other methods (put, patch, delete) similarly
}
```

## Adding Default Configuration

One advantage of creating your own provider is the ability to add defaults and customizations:

```js
import axios from 'axios'

// Create axios instance with defaults
const client = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const http = {
  get: client.get,
  post: client.post,
  put: client.put,
  patch: client.patch,
  delete: client.delete
}
```

## Authentication and Tokens

A common need is handling authentication tokens:

```js
export const http = (() => {
  // Store token in closure
  let token = null

  // Create methods with token handling
  return {
    setToken(newToken) {
      token = newToken
    },

    async get(url, options = {}) {
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }

      return fetch(url, {
        method: 'GET',
        headers,
        ...options
      }).then((response) => {
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
        return response.json()
      })
    }

    // Implement other methods similarly
  }
})()
```

## Using Local Storage for Tokens

You can combine providers to create more powerful abstractions:

```js
export const localStorage = {
  get(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key))
    } catch (e) {
      return null
    }
  },
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export const http = {
  async get(url, options = {}) {
    // Access localStorage provider through context
    const token = this.context.localStorage.get('token')

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }

    // Continue with request...
  }

  // Other methods...
}
```

## Error Handling

Robust error handling is crucial for HTTP requests:

```js
import { CerebralError } from 'cerebral'

// Custom HTTP error class
export class HttpError extends CerebralError {
  constructor(message, status, data) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

export const http = {
  async get(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        ...options
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new HttpError(
          `Request failed with status ${response.status}`,
          response.status,
          errorData
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof HttpError) throw error

      throw new HttpError('Network error', 0, { originalError: error.message })
    }
  }

  // Other methods with similar error handling
}
```

Then in your module:

```js
import { HttpError } from './errors'

export default {
  // ...module definition
  catch: [[HttpError, sequences.handleHttpError]]
}
```

## Domain-Specific API Providers

For larger applications, you might want to create domain-specific API providers instead of a generic HTTP provider:

```js
export const usersApi = {
  async getUser(id) {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  },

  async updateUser(id, data) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  }

  // Other user-related operations
}

export const postsApi = {
  async getPosts(filters = {}) {
    const queryString = new URLSearchParams(filters).toString()
    const response = await fetch(`/api/posts?${queryString}`)
    if (!response.ok) throw new Error('Failed to fetch posts')
    return response.json()
  }

  // Other post-related operations
}
```

This approach:

1. Makes sequences more readable with explicit method names
2. Centralizes API endpoint knowledge
3. Allows for specialized error handling per domain
4. Makes testing easier with more focused mocking

## Testing HTTP Providers

One major advantage of providers is easy mocking during tests:

```js
import main from './main'
import App from 'cerebral'

describe('My sequence', () => {
  it('should handle successful response', () => {
    const mockHttp = {
      get: jest.fn().mockResolvedValue({ id: '123', name: 'Test User' })
    }

    const app = App(main, {
      providers: {
        http: mockHttp
      }
    })

    return app
      .getSequence('fetchUser')({ id: '123' })
      .then(() => {
        expect(mockHttp.get).toHaveBeenCalledWith('/api/users/123')
        expect(app.getState('currentUser.name')).toBe('Test User')
      })
  })

  it('should handle errors', () => {
    const mockHttp = {
      get: jest.fn().mockRejectedValue(new Error('Network failure'))
    }

    const app = App(main, {
      providers: {
        http: mockHttp
      }
    })

    return app
      .getSequence('fetchUser')({ id: '123' })
      .then(() => {
        expect(app.getState('error')).toBe('Network failure')
      })
  })
})
```

## TypeScript Support

If you're using TypeScript, you can define interfaces for your HTTP provider:

```typescript
// HTTP provider types
interface HttpOptions {
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
  [key: string]: any
}

interface HttpProvider {
  get<T>(url: string, options?: HttpOptions): Promise<T>
  post<T>(url: string, data: any, options?: HttpOptions): Promise<T>
  put<T>(url: string, data: any, options?: HttpOptions): Promise<T>
  patch<T>(url: string, data: any, options?: HttpOptions): Promise<T>
  delete<T>(url: string, options?: HttpOptions): Promise<T>
  setToken(token: string | null): void
}

// Implementation
export const http: HttpProvider = {
  // Implementation...
}
```

## Summary

Creating custom HTTP providers in Cerebral 5 gives you:

1. Complete control over HTTP request handling
2. Flexibility to use your preferred HTTP library
3. Ability to add application-specific functionality
4. Better testability through easier mocking

By treating HTTP requests as side effects handled by providers, Cerebral maintains its clean separation of concerns while giving you the freedom to implement HTTP functionality in the way that best suits your application's needs.
