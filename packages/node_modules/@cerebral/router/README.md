# @cerebral/router

## Install
**NPM**

`npm install @cerebral/router@next --save --save-exact`

**YARN**

`yarn add @cerebral/router@next --exact`

## Description
The router of Cerebral does not affect your view layer. A url change triggers a signal that puts your application in the correct state. Your view just reacts to this state, like any other state change.

## API

### instantiate

```js
import {Controller} from 'cerebral'
import Router from '@cerebral/router'

const controller = Controller({
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
})
```

### routes

```js
import {Controller} from 'cerebral'
import Router from '@cerebral/router'

const controller = Controller({
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
})
```

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
