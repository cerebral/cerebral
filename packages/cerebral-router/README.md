# cerebral-router

## Install
**NPM**

`npm install cerebral-router@next --save --save-exact`

**YARN**

`yarn add cerebral-router@next --exact`

## Description
The router of Cerebral does not affect your view layer. A url change triggers a signal that puts your application in the correct state. Your view just reacts to this state, like any other state change.

## API

### instantiate

```js
import {Controller} from 'cerebral'
import Router from 'cerebral-router'

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
import Router from 'cerebral-router'

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

### getUrl
```js
function myAction({router}) {
  // Get current url, example: "/items"
  router.getUrl()
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
import {goTo} from 'cerebral-router/operators'

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
import {redirect} from 'cerebral-router/operators'

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
import {redirectToSignal} from 'cerebral-router/operators'

export default [
  redirectToSignal('app.itemsRouted', props`payload`)
]
```
