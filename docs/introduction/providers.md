# Providers

## What are Providers?

In Cerebral, providers are the bridge between your application and the outside world. They handle all the side effects in your application - everything from API calls to browser APIs, local storage, or any external system.

Providers offer several key benefits:

1. They create an **explicit API** for side effects in your application
2. They are automatically **tracked by the debugger**, giving you insight into their usage
3. They're **easy to mock** during testing, making your tests more reliable

## Creating a Simple Provider

Let's create a provider to communicate with the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API:

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'

const API_URL = 'https://jsonplaceholder.typicode.com'

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
  providers: {
    api: {
      getPosts() {
        return fetch(`${API_URL}/posts`).then((response) => response.json())
      },
      getUser(id) {
        return fetch(`${API_URL}/users/${id}`).then((response) =>
          response.json()
        )
      }
    }
  }
})
```

Instead of creating a generic HTTP provider, we've built a specific API provider for JSONPlaceholder. This approach is recommended as it makes your application code more readable and focused.

## Using Providers in Actions

Once defined, providers are available in the context object passed to your actions:

```js
export function getPosts({ api, state }) {
  state.set('isLoadingPosts', true)

  return api
    .getPosts()
    .then((posts) => ({ posts }))
    .catch((error) => ({ error: error.message }))
}
```

## Provider Best Practices

### 1. Create Domain-Specific Providers

Instead of generic providers, create providers that speak the language of your domain:

```js
// GOOD: Domain-specific provider
providers: {
  usersApi: {
    getUsers() { /* ... */ },
    getUserById(id) { /* ... */ }
  }
}

// AVOID: Generic provider that needs configuration in actions
providers: {
  http: {
    get(url) { /* ... */ },
    post(url, data) { /* ... */ }
  }
}
```

### 2. Handle Errors Appropriately

Make your providers handle errors in a consistent way:

```js
userApi: {
  getUser(id) {
    return fetch(`/api/users/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`)
        }
        return response.json()
      })
  }
}
```

### 3. Compose Providers

Providers can use other providers through `this.context`:

```js
providers: {
  logger: {
    log(message) {
      console.log(`[${new Date().toISOString()}]`, message)
    }
  },
  userApi: {
    getUser(id) {
      this.context.logger.log(`Fetching user with ID: ${id}`)
      return fetch(`/api/users/${id}`).then(response => response.json())
    }
  }
}
```

## Common Provider Examples

### Local Storage Provider

```js
const storageProvider = {
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}
```

### Authentication Provider

```js
const authProvider = {
  login(credentials) {
    return fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then((response) => response.json())
  },
  logout() {
    return fetch('/api/logout', { method: 'POST' })
  },
  getToken() {
    return localStorage.getItem('authToken')
  }
}
```

With providers, you can build a clean separation between your application logic and external systems, making your code more testable, understandable, and easier to maintain.
