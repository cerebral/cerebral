# Server Side Rendering

Server-side rendering (SSR) allows you to deliver pre-rendered HTML to users for faster initial page loads and better SEO. Cerebral provides robust support for SSR through the `UniversalApp` API.

## Understanding the SSR Flow

When a user visits your application, the typical SSR flow follows these steps:

1. **Server receives request** - User requests a URL like `www.example.com`
2. **Server initializes app state** - A Cerebral app instance is created with initial state
3. **Server fetches necessary data** - Data required for the current route is fetched
4. **Server renders HTML** - Components are rendered to HTML string using the populated state
5. **Server returns HTML response** - HTML is sent to the browser with embedded state
6. **Client hydrates the app** - Client-side JavaScript takes over without refetching data

## Setting Up SSR with Cerebral

### 1. Create a Universal App Instance

On your server, create a fresh `UniversalApp` instance for each request:

```js
import { UniversalApp } from 'cerebral'
import main from '../client/main' // Your main module

app.get('/', (req, res) => {
  // Create a new app instance for each request to prevent state leakage
  const cerebral = UniversalApp(main)

  // Continue with rendering...
})
```

### 2. Populate Initial State

Fetch any necessary data and update the app state:

```js
// Run a sequence to fetch data and update state
await cerebral.runSequence(
  [
    // Fetch data based on the current route
    ({ http, props }) => {
      return http.get('/api/data').then((response) => ({ data: response.data }))
    },
    // Update state with the fetched data
    ({ store, props }) => {
      store.set(state`pageData`, props.data)
    }
  ],
  {
    // Initial props for the sequence
    route: req.path
  }
)
```

### 3. Render Components to HTML

Use your view library's server rendering method:

```js
// With React
import { renderToString } from 'react-dom/server'
import { Container } from '@cerebral/react'
import App from '../client/components/App'

// Render the app to a string
const appHtml = renderToString(
  <Container app={cerebral}>
    <App />
  </Container>
)
```

### 4. Generate State Hydration Script

Create a script tag containing the state changes to hydrate the client app:

```js
// Generate script tag with serialized state
const stateScript = cerebral.getScript()
```

### 5. Return Complete HTML Response

Combine everything into a complete HTML response:

```js
res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>My Cerebral App</title>
    ${stateScript}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="/static/bundle.js"></script>
  </body>
</html>`)
```

### 6. Client-Side Hydration

On the client, use a regular `App` instance that will automatically pick up the state:

```js
// client.js
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'cerebral'
import { Container } from '@cerebral/react'
import main from './main'
import AppComponent from './components/App'

// Standard app - automatically picks up window.CEREBRAL_STATE
const app = App(main)

// Hydrate the app
const root = createRoot(document.getElementById('root'))
root.render(
  <Container app={app}>
    <AppComponent />
  </Container>
)
```

## Complete SSR Example

This example shows a complete Express server setup for SSR:

```js
import express from 'express'
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { UniversalApp, state } from 'cerebral'
import { Container } from '@cerebral/react'

import main from '../client/main'
import App from '../client/components/App'

const server = express()
const PORT = process.env.PORT || 3000

// Serve static files
server.use('/static', express.static(path.resolve(__dirname, '../dist')))

// Handle all routes
server.get('*', async (req, res) => {
  try {
    // 1. Create fresh app instance
    const cerebral = UniversalApp(main)

    // 2. Run initialization sequence based on route
    await cerebral.runSequence(
      [
        ({ store, props }) => {
          // Store current URL
          store.set(state`currentPage`, props.url)

          // We could fetch data based on the route here
          // For example, if url is /users/123, fetch user with id 123
          if (props.url.startsWith('/users/')) {
            const userId = props.url.split('/')[2]
            return { userId }
          }
        },
        // Conditionally fetch data based on previous action's return value
        ({ http, props }) => {
          if (props.userId) {
            return http
              .get(`/api/users/${props.userId}`)
              .then((response) => ({ user: response.data }))
          }
        },
        // Store fetched data
        ({ store, props }) => {
          if (props.user) {
            store.set(state`currentUser`, props.user)
          }
        }
      ],
      {
        url: req.path
      }
    )

    // 3. Render the app
    const appHtml = renderToString(
      <Container app={cerebral}>
        <App />
      </Container>
    )

    // 4. Get state script for hydration
    const stateScript = cerebral.getScript()

    // 5. Send the response
    res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Cerebral SSR Example</title>
    ${stateScript}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="/static/bundle.js"></script>
  </body>
</html>`)
  } catch (error) {
    console.error('SSR Error:', error)
    res.status(500).send('Server Error')
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Router Integration

When implementing SSR with routing, you need to synchronize the server-side state with the current route:

```js
await cerebral.runSequence(
  [
    ({ store, props }) => {
      // Initialize routing state based on the request URL
      store.set(state`router.currentPath`, props.url)
      store.set(state`router.query`, props.query)

      // Extract route parameters if needed
      const params = extractParamsFromUrl(props.url)
      store.set(state`router.params`, params)

      // Determine which data to load based on the route
      return {
        route: determineRoute(props.url),
        params
      }
    },
    // Load data based on the route
    ({ http, props }) => {
      switch (props.route) {
        case 'home':
          return http
            .get('/api/home-data')
            .then((response) => ({ pageData: response.data }))
        case 'user':
          return http
            .get(`/api/users/${props.params.id}`)
            .then((response) => ({ userData: response.data }))
        default:
          return { pageData: null }
      }
    },
    // Store loaded data
    ({ store, props }) => {
      if (props.pageData) {
        store.set(state`pageData`, props.pageData)
      }
      if (props.userData) {
        store.set(state`currentUser`, props.userData)
      }
    }
  ],
  {
    url: req.path,
    query: req.query
  }
)
```

Your client-side router should be configured to read from and update this same state structure to ensure consistency between server and client rendering.

## Performance Optimizations

To optimize your SSR implementation:

1. **Use streaming where possible** - For large pages, consider streaming HTML response
2. **Cache rendered content** - For static content, implement server-side caching
3. **Selective hydration** - Only hydrate interactive parts of your page
4. **Defer non-critical data loading** - Load non-essential data on the client

## Common Challenges

### 1. Browser-only APIs

Handle APIs that only exist in the browser:

```js
function safelyUseWindow({ props }) {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('key', props.value)
  }
}
```

### 2. Different environment configurations

Create environment-specific providers:

```js
const localStorageProvider =
  typeof window !== 'undefined'
    ? {
        get(key) {
          return window.localStorage.getItem(key)
        },
        set(key, value) {
          window.localStorage.setItem(key, value)
        }
      }
    : {
        get() {
          return null
        },
        set() {}
      }

// In your module
export default {
  providers: {
    storage: localStorageProvider
  }
}
```

## Best Practices

1. **Create a fresh app instance per request** - Prevents state leakage between users
2. **Error handling** - Implement proper error boundaries and fallbacks
3. **Track performance** - Measure and optimize render times
4. **Selective SSR** - Consider which routes benefit most from SSR
5. **Progressive enhancement** - Ensure your app works without JavaScript

## Conclusion

Server-side rendering with Cerebral gives you the benefits of fast initial page loads and SEO while maintaining the power and organization of a Cerebral application. By using the `UniversalApp` API, you can seamlessly share state between server and client.

For more detailed API information, refer to the [UniversalApp API documentation](/docs/api/universalapp.html).
