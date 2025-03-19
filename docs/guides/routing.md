# Routing

There are two different ways to approach routing in Cerebral applications. You can either handle routing in your view layer or treat URL changes as events that trigger sequences in your application. In this guide, we'll explore the "Cerebral first" approach to routing using the browser's native History API.

## Cerebral First Router

Using the browser's built-in History API provides a reliable and future-proof approach to routing that doesn't depend on third-party libraries:

```js
import { routeToRoot, routeToItems, routeToItem } from './sequences'

// Route pattern matching utility
function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return false

  const params = {}

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    // Check for parameters (starting with :)
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1)
      params[paramName] = pathPart
    } else if (patternPart !== pathPart) {
      return false
    }
  }

  return { match: true, params }
}

export default ({ app }) => {
  // Store routes for matching
  const routes = new Map()

  // We create a route factory which takes the route url and
  // the sequences that should run when it triggers
  function route(url, sequence) {
    // Store our routes for the matcher function
    routes.set(url, (params, query) => {
      app.runSequence(url, sequence, { params, query })
    })

    // Return an action usable in components
    return ({ props }) => {
      const urlWithReplacedParams = Object.keys(props.params || {}).reduce(
        (currentUrl, param) => {
          return currentUrl.replace(`:${param}`, props.params[param])
        },
        url
      )

      // Add query string if provided
      let queryString = ''
      if (props.query) {
        const searchParams = new URLSearchParams()
        Object.entries(props.query).forEach(([key, value]) => {
          searchParams.append(key, value)
        })
        queryString = '?' + searchParams.toString()
      }

      // Navigate using History API
      const fullUrl = urlWithReplacedParams + queryString
      window.history.pushState(null, '', fullUrl)

      // Manually trigger route handling since pushState doesn't fire events
      handleRouteChange()
    }
  }

  // Function to handle route changes
  function handleRouteChange() {
    const path = window.location.pathname
    const query = {}

    // Parse query string
    const searchParams = new URLSearchParams(window.location.search)
    for (const [key, value] of searchParams.entries()) {
      query[key] = value
    }

    // Find matching route
    for (const [pattern, handler] of routes.entries()) {
      const result = matchRoute(pattern, path)

      if (result.match) {
        handler(result.params, query)
        break
      }
    }
  }

  // Set up route handling
  app.on('initialized', () => {
    // Handle initial route
    handleRouteChange()

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange)
  })

  return {
    sequences: {
      routeToRoot: route('/', routeToRoot),
      routeToItems: route('/items', routeToItems),
      routeToItem: route('/items/:id', routeToItem)
    }
  }
}
```

This approach uses the browser's native History API and implements a simple pattern matching system. With this setup, you can trigger URL changes from components:

```js
import { connect } from '@cerebral/react'
import { sequences } from 'cerebral'

export default connect(function MyComponent({ get }) {
  const routeToItem = get(sequences`routeToItem`)

  return (
    <button onClick={() => routeToItem({ params: { id: 123 } })}>
      Go to 123
    </button>
  )
})
```

## Query Strings

Many applications need query string support. You can easily add this:

```js
import { routeToRoot, routeToItems, routeToItem } from './sequences'

// Route pattern matching utility
function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return false

  const params = {}

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    // Check for parameters (starting with :)
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1)
      params[paramName] = pathPart
    } else if (patternPart !== pathPart) {
      return false
    }
  }

  return { match: true, params }
}

export default ({ app }) => {
  // Store routes for matching
  const routes = new Map()

  // We create a route factory which takes the route url and
  // the sequences that should run when it triggers
  function route(url, sequence) {
    // Store our routes for the matcher function
    routes.set(url, (params, query) => {
      app.runSequence(url, sequence, { params, query })
    })

    // Return an action usable in components
    return ({ props }) => {
      const urlWithReplacedParams = Object.keys(props.params || {}).reduce(
        (currentUrl, param) => {
          return currentUrl.replace(`:${param}`, props.params[param])
        },
        url
      )

      // Add query string if provided
      let queryString = ''
      if (props.query) {
        const searchParams = new URLSearchParams()
        Object.entries(props.query).forEach(([key, value]) => {
          searchParams.append(key, value)
        })
        queryString = '?' + searchParams.toString()
      }

      // Navigate using History API
      const fullUrl = urlWithReplacedParams + queryString
      window.history.pushState(null, '', fullUrl)

      // Manually trigger route handling since pushState doesn't fire events
      handleRouteChange()
    }
  }

  // Function to handle route changes
  function handleRouteChange() {
    const path = window.location.pathname
    const query = {}

    // Parse query string
    const searchParams = new URLSearchParams(window.location.search)
    for (const [key, value] of searchParams.entries()) {
      query[key] = value
    }

    // Find matching route
    for (const [pattern, handler] of routes.entries()) {
      const result = matchRoute(pattern, path)

      if (result.match) {
        handler(result.params, query)
        break
      }
    }
  }

  // Set up route handling
  app.on('initialized', () => {
    // Handle initial route
    handleRouteChange()

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange)
  })

  return {
    sequences: {
      routeToRoot: route('/', routeToRoot),
      routeToItems: route('/items', routeToItems),
      routeToItem: route('/items/:id', routeToItem)
    }
  }
}
```

You can then use the `query` property in components:

```js
import { connect } from '@cerebral/react'
import { sequences } from 'cerebral'

export default connect(function MyComponent({ get }) {
  const routeToItems = get(sequences`routeToItems`)

  return (
    <button onClick={() => routeToItems({ query: { limit: 10 } })}>
      Go to items with limit
    </button>
  )
})
```

## Managing Nested Routes

When you have two routes such as `/items` and `/items/:id`, you might want to run the logic for the first route when the second is triggered. This is often useful when you show a page with items and the ID indicates which modal should be displayed on top of the list.

The two routes are defined separately:

```js
{
  sequences: {
    routeToRoot: route('/', routeToRoot),
    routeToItems: route('/items', routeToItems),
    routeToItem: route('/items/:id', routeToItem)
  }
}
```

To ensure that the items logic runs when `/items/:id` is triggered, you can compose the sequences:

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'
import * as actions from './actions'

export const routeToRoot = set(state`page`, 'home')

export const routeToItems = [
  set(state`page`, 'items'),
  actions.getItems,
  set(state`items`, props`items`)
]

export const routeToItem = [
  routeToItems, // We include the parent route sequence
  actions.getItemDetails,
  set(state`itemDetails.${props`params.id`}`, props`itemDetails`),
  set(state`currentItemId`, props`params.id`)
]
```

This approach will first get the items and then get the specific item details. You can optimize this by running these operations in parallel:

```js
import { parallel, set } from 'cerebral/factories'
import { state, props } from 'cerebral'
import * as actions from './actions'

export const routeToRoot = set(state`page`, 'home')

export const routeToItems = [
  set(state`page`, 'items'),
  actions.getItems,
  set(state`items`, props`items`)
]

export const routeToItem = parallel([
  routeToItems,
  [
    actions.getItemDetails,
    set(state`itemDetails.${props`params.id`}`, props`itemDetails`),
    set(state`currentItemId`, props`params.id`)
  ]
])
```

Now the app will immediately set the page, and both the items list and the item details will load in parallel. How you compose this depends on your data requirements and the user experience you want to create.

## Alternative Routing Approaches

If you prefer a different approach to routing, here are some options:

### 1. View-Library Specific Routers

Most view libraries have their own routing solutions that remain actively maintained:

- React: [React Router](https://reactrouter.com/)
- Vue: [Vue Router](https://router.vuejs.org/)
- Angular: [Angular Router](https://angular.io/guide/router)

These can be integrated with Cerebral by triggering sequences when routes change.

### 2. Enhanced History API Router

For a more robust solution, you can extend the basic History API approach with additional features:

```js
export default ({ app }) => {
  // Route configuration
  const routes = [
    {
      path: '/',
      sequence: 'routeToRoot'
    },
    {
      path: '/items',
      sequence: 'routeToItems'
    },
    {
      path: '/items/:id',
      sequence: 'routeToItem'
    }
  ]

  // Process route configuration
  const processedRoutes = routes.map((route) => ({
    ...route,
    parts: route.path.split('/').filter(Boolean),
    params: route.path
      .split('/')
      .filter((part) => part.startsWith(':'))
      .map((part) => part.slice(1))
  }))

  // Find matching route
  function findMatchingRoute(path) {
    const pathParts = path.split('/').filter(Boolean)

    for (const route of processedRoutes) {
      if (route.parts.length !== pathParts.length) continue

      let isMatch = true
      const params = {}

      for (let i = 0; i < route.parts.length; i++) {
        const routePart = route.parts[i]
        const pathPart = pathParts[i]

        if (routePart.startsWith(':')) {
          params[routePart.slice(1)] = pathPart
        } else if (routePart !== pathPart) {
          isMatch = false
          break
        }
      }

      if (isMatch) {
        return {
          route,
          params
        }
      }
    }

    return null
  }

  // Set up URL handling
  app.on('initialized', () => {
    // Handle route changes
    function handleRouteChange() {
      const path = window.location.pathname
      const query = Object.fromEntries(
        new URLSearchParams(window.location.search)
      )

      const match = findMatchingRoute(path)

      if (match) {
        app.getSequence(match.route.sequence)({
          params: match.params,
          query
        })
      } else {
        // Handle 404
        app.getSequence('routeNotFound')({ path })
      }
    }

    // Initial route
    handleRouteChange()

    // Listen for browser navigation
    window.addEventListener('popstate', handleRouteChange)
  })

  // Return module definition
  return {
    state: {
      currentPath: window.location.pathname,
      currentParams: {},
      currentQuery: {}
    },
    sequences: {
      navigateTo: ({ props, store }) => {
        const { path, params = {}, query = {} } = props

        // Build URL
        let resolvedPath = path
        Object.entries(params).forEach(([key, value]) => {
          resolvedPath = resolvedPath.replace(`:${key}`, value)
        })

        // Add query string
        const queryString =
          Object.keys(query).length > 0
            ? '?' + new URLSearchParams(query).toString()
            : ''

        // Update state
        store.set(state`router.currentPath`, resolvedPath)
        store.set(state`router.currentParams`, params)
        store.set(state`router.currentQuery`, query)

        // Update URL
        window.history.pushState(null, '', resolvedPath + queryString)
      }
    }
  }
}
```

## Server-Side Rendering Integration

The route matching utilities we've created are usable in both browser and server environments, making them ideal for SSR. Here's how to integrate with the SSR approach described in the [SSR guide](/docs/guides/ssr.md):

```js
// Shared route matching utility (used on both client and server)
export function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return false

  const params = {}

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1)
      params[paramName] = pathPart
    } else if (patternPart !== pathPart) {
      return false
    }
  }

  return { match: true, params }
}

// Server-side sequence to set up routing state
export const initializeRouteState = [
  ({ store, props }) => {
    // Store URL information from the request
    store.set(state`router.currentPath`, props.url)

    // Parse and store query parameters
    const query = {}
    if (props.query) {
      Object.entries(props.query).forEach(([key, value]) => {
        query[key] = value
      })
    }
    store.set(state`router.query`, query)

    // Match route and extract parameters
    const routes = [
      { path: '/', name: 'home' },
      { path: '/items', name: 'items' },
      { path: '/items/:id', name: 'item' }
    ]

    let matchedRoute = null
    let routeParams = {}

    for (const route of routes) {
      const result = matchRoute(route.path, props.url)
      if (result.match) {
        matchedRoute = route.name
        routeParams = result.params
        break
      }
    }

    // Store extracted parameters
    store.set(state`router.params`, routeParams)
    store.set(state`router.currentRoute`, matchedRoute)

    return {
      route: matchedRoute,
      params: routeParams
    }
  }
  // Next actions can load data based on route
]
```

On the server, in your Express route handler:

```js
app.get('*', async (req, res) => {
  // Create a fresh app instance
  const cerebral = UniversalApp(main)

  // Initialize routing state using the request URL
  await cerebral.runSequence(initializeRouteState, {
    url: req.path,
    query: req.query
  })

  // Load data based on route
  await cerebral.runSequence('loadRouteData')

  // Render...
})
```

On the client, this state will be hydrated automatically, and then your client-side router can work with the same state structure. This ensures a seamless handoff from server to client.

## Advanced Routing Patterns

### Route Guards

You can implement route guards by adding conditions to your route sequences:

```js
export const routeToAdminArea = [
  ({ store, get, path }) => {
    const isAdmin = get(state`user.isAdmin`)

    return isAdmin ? path.authorized() : path.unauthorized()
  },
  {
    authorized: [set(state`page`, 'admin'), actions.loadAdminData],
    unauthorized: [
      set(state`page`, 'unauthorized'),
      set(state`redirectAfterLogin`, '/admin')
    ]
  }
]
```

### Route Transitions

For smooth route transitions:

```js
export const routeToItems = [
  // Start transition
  set(state`isTransitioning`, true),

  // Load data in parallel with transition
  parallel([
    [actions.getItems, set(state`items`, props`items`)],
    [wait(300)] // Minimum transition time
  ]),

  // Update page and finish transition
  set(state`page`, 'items'),
  set(state`isTransitioning`, false)
]
```

Remember that Cerebral gives you complete control over these flows, making complex routing behavior manageable and declarative.
