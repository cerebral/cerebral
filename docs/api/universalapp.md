# UniversalApp

The `UniversalApp` creates a special version of the Cerebral controller for server-side rendering (SSR). It allows you to:

1. Initialize your app's state on the server
2. Render the app with the populated state
3. Produce a script tag containing state changes for client hydration

## Initialization

```js
import { UniversalApp } from 'cerebral'
import main from './main'

const app = UniversalApp(main, {
  // Same options as App
  devtools: null,
  throwToConsole: true
})
```

```marksy
<Info>
`UniversalApp` accepts the same options as the standard [App](/docs/api/app.html).
</Info>
```

## Methods

`UniversalApp` includes all methods from the standard [App](/docs/api/app.html), plus the following:

### run / runSequence

Execute sequences to set up the initial state.

```js
// Run an inline sequence
app.run(
  [
    ({ store, props }) => {
      store.set(state`user`, props.user)
    }
  ],
  {
    user: fetchedUserData
  }
)

// Run a named module sequence
app.runSequence('app.initialize', {
  user: fetchedUserData
})
```

Both methods return a Promise that resolves when the sequence completes:

```js
app.runSequence('app.initialize', { user }).then(() => {
  // State is now populated
  renderApp()
})
```

### setState

Directly set state at a specific path (synchronous operation).

```js
// Set a value by path
app.setState('user.isLoggedIn', true)

// Set a nested object
app.setState('user', {
  id: '123',
  name: 'John',
  isLoggedIn: true
})
```

### getChanges

Returns a map of all state changes made since initialization.

```js
// After running sequences to set state
const stateChanges = app.getChanges()
// { "user.isLoggedIn": true, "user.id": "123" }
```

### getScript

Generates a script tag containing all state changes, which the client app will use for hydration.

```js
// Get the script tag HTML
const scriptTag = app.getScript()
// <script>window.CEREBRAL_STATE = {"user.isLoggedIn":true,"user.id":"123"}</script>
```

This should be included in the HTML response, typically in the `<head>` section.

## Complete SSR Example

This example shows a complete server-side rendering setup with React:

```js
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { UniversalApp, state } from 'cerebral'
import { Container } from '@cerebral/react'
import App from '../client/components/App'
import main from '../client/main'

const server = express()

server.get('/', async (req, res) => {
  // Create a fresh app instance for each request
  const app = UniversalApp(main)

  // Run initialization sequence with request data
  await app.runSequence([fetchUser, setInitialState], {
    query: req.query,
    cookies: req.cookies
  })

  // Render the app to string
  const appHtml = renderToString(
    <Container app={app}>
      <App />
    </Container>
  )

  // Get the state hydration script
  const stateScript = app.getScript()

  // Return the complete HTML
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
    ${stateScript}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="/static/bundle.js"></script>
  </body>
</html>`)
})

// Example actions for initialization
function fetchUser({ http, props }) {
  // Fetch user data based on cookie
  return http
    .get(`/api/users/me`, {
      headers: {
        Cookie: props.cookies
      }
    })
    .then((response) => ({ user: response.data }))
    .catch(() => ({ user: null }))
}

function setInitialState({ store, props }) {
  // Set the user in state
  store.set(state`user`, props.user)

  // Set initial query parameters
  store.set(state`query`, props.query)
}

server.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

## Client-Side Hydration

On the client side, the standard App automatically picks up the state changes:

```js
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'cerebral'
import { Container } from '@cerebral/react'
import main from './main'
import AppComponent from './components/App'

// Standard app picks up CEREBRAL_STATE automatically
const app = App(main)

// Render and hydrate the app
const root = createRoot(document.getElementById('root'))
root.render(
  <Container app={app}>
    <AppComponent />
  </Container>
)
```

## Caveats and Best Practices

1. **Create fresh instances**: Create a new `UniversalApp` instance for each request to prevent state leakage between users.

2. **Async operations**: Ensure all async operations complete before rendering.

3. **Environment differences**: Be mindful of APIs that may exist only in browser or server environments.

4. **Error handling**: Add proper error handling for server-side sequences.

5. **Transpilation**: When using JSX on the server, ensure you're properly transpiling your server code.

For more detailed information on server-side rendering, see the [SSR guide](/docs/guides/ssr.html).
