# @cerebral/router

## Install
**NPM**

`npm install @cerebral/router --save`

**YARN**

`yarn add @cerebral/router`

## Description
The router of Cerebral does not affect your view layer. A url change triggers a signal that puts your application in the correct state. Your view just reacts to this state, like any other state change.

## API

### instantiate

```js
import {Controller} from 'cerebral'
import Router from '@cerebral/router'

const controller = Controller({
  modules: {
    router: Router({
      // Define routes and point to signal paths
      routes: {
        '/': 'app.homeRouted'
      },

      // Merge query params into payload of signal
      query: false,

      // Only react to hash urls
      onlyHash: false,

      // Set a base url, if your app lives on a subpath
      baseUrl: null,

      // Will allow none matching routes on same origin to run as normal
      allowEscape: false,

      // Will make the router not run the initial route
      preventAutostart: false
    })
  }
})
```

### routes definition (simple)

You can define routes either with the shortcut "Object" format where
keys represent urls and values represent signal paths:

```js
import {Controller} from 'cerebral'
import Router from '@cerebral/router'

const controller = Controller({
  modules: {
    router: Router({
      routes: {
        // Trigger signal when root routed
        '/': 'app.homeRouted',

        // Trigger signal, passing in "itemId" on payload, example:
        // "/items/123" -> {itemId: '123'}
        '/items/:itemId': 'app.itemRouted',

        // Nest routes
        '/users': {
          '/': 'app.usersRouted',
          '/:userId': 'app.userRouted'
        }
      }
    })
  }
})
```

### routes definition (advanced)

When you need more advanced behavior, you define routes with an array of
route definitions like this:

```js
import {Controller} from 'cerebral'
import Router from '@cerebral/router'

const controller = Controller({
  modules: {
    router: Router({
      routes: [
        {
          path: '/',
          signal: 'app.homeRouted'
        },
        {
          path: '/project/:projectId',
          map: {projectId: state`user.projectId`},
          signal: 'app.settingsRouted',
        },
        {
          path: '/settings/:tab',
          // whitelist 'focus' query parameter
          // and 'tab' url parameter
          map: {tab: props`tab`, focus: props`focus`},
          signal: 'app.settingsRouted',
        }
      ]
    })
  }
})
```

### map state

The `map` parameter let's you create a mapping between state and
url parameters. This works both ways: when you change the state, 
it sets the url from state and when the url changes, it triggers
the state changes.

Note that this automatic mapping is only active if the current url
is active.

Note also that when you use state mapping, the 'signal' is optional.

### map props

As soon as there is a 'map' entry, all parameters that we want to pass through must be present. So the `props` type is used for whitelisting. In the last example above, we want to enable the 'focus' query parameter
and we have to whitelist 'tab' as well.

### signal payload

When a mapped signal triggers it will trigger with a payload if either **params** are defined on the route or the url has a **query**. For example */items/123?showUser=true* will produce the following payload to the signal, available on the **props** :

```js
{
  itemId: '123',
  showUser: true
}
```

### getUrl
```js
function myAction({router}) {
  // If url is "http://localhost:3000/items?foo=bar", returns "/items?foo=bar"
  router.getUrl()
}
```

### getUrlBase
```js
function myAction({router}) {
  // If url is "http://localhost:3000/items?foo=bar", returns "/items"
  router.getUrlBase()
}
```

### getUrlQuery
```js
function myAction({router}) {
  // If url is "http://localhost:3000/items?foo=bar", returns "foo=bar"
  router.getUrlQuery()
}
```

### goTo
*action*
```js
function myAction({router}) {
  // Go to a new url
  router.goTo('/items')
}
```

*factory*
```js
import {goTo} from '@cerebral/router/operators'

export default [
  goTo('/items')
]
```

### redirect
*action*
```js
function myAction({router}) {
  // Go to a new url, replacing current url
  router.redirect('/items')
}
```

*factory*
```js
import {redirect} from '@cerebral/router/operators'

export default [
  redirect('/items')
]
```

### reload
*action*
```js
function myAction({router}) {
  router.reload()
}
```

*factory*
```js
import {reload} from '@cerebral/router/operators'

export default [
  reload
]
```


### redirectToSignal
*action*
```js
function myAction({router}) {
  // Trigger a signal bound to router
  router.redirectToSignal('app.itemsRouted', {foo: 'bar'})
}
```

*factory*
```js
import {redirectToSignal} from '@cerebral/router/operators'

export default [
  redirectToSignal('app.itemsRouted', props`payload`)
]
```
