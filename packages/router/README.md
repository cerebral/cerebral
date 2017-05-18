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
      // Define routes and point to signals
      routes: [{
        path: '/',
        signal: 'app.homeRouted'
      }]

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

### routes
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
          // Params are passed as props to the signal.
          // Query parameters are also passed as props
          path: '/projects/:projectId',
          signal: 'app.projectRouted',
        }
      ]
    })
  }
})
```

When a mapped signal triggers it will trigger with a payload if either **params** are defined on the route or the url has a **query**. For example */projects/123?showUser=true* will produce the following payload to the signal, available on the **props** :

```js
{
  projectId: '123',
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

### EXPERIMENTAL
We are currently working on functionality that allows you to bind urls to your state, also allowing you to create more complex relationships between your application state and the url. This API is very likely to change, but please feel free to try it out and give us feedback.

#### mapping
The `map` property let's you create a mapping between state and
url parameters. This works both ways: when you change the state,
it sets the url from state and when the url changes, it triggers
the state changes.

This automatic mapping is only active if the current url
is active. Note also that when you use state mapping, the 'signal'
is optional.


```js
import {Controller} from 'cerebral'
import Router from '@cerebral/router'

const controller = Controller({
  modules: {
    router: Router({
      routes: [
        {
          path: '/projects/:projectId',
          map: {projectId: state`app.currentProjectId`},
          signal: 'app.projectRouted',
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


#### computed mapping

You can use a `compute` value here to run a computed in order to prepare
the value passed to build the url.

```js
map: {
  urlKey: compute(/* ... */)
}
```

If you use a `compute` the router cannot map back from the url key to the
state and you need to define a reverse map with `rmap`:

```js
rmap: {
  'some.state': compute(props`urlKey`, (urlKey) => /* ... */),
  'other.state': compute(props`urlKey`, (urlKey) => /* ... */)
}
```

```js
import {Controller} from 'cerebral'
import Router from '@cerebral/router'
import {props, state} from 'cerebral/tags'

const controller = Controller({
  modules: {
    router: Router({
      routes: [
        {
          path: '/settings/:tab',
          // This maps a complex app state to the `opts` param in
          // url query.
          map: {
            opts: compute(
              state`projectId`,
              state`user.lang`,
              (projectId, lang) => ({projectId, lang})
            )
          },
          // This parses the url query `opts` into two state values.
          // It does a 'reverse map' hence the 'rmap' name.
          rmap: {
            'projectId': compute(
              state`projectId`,
              props`opts`,
              (projectId, opts) => opts.projectId || projectId
            ),
            'user.lang': compute(
              state`validLangs`,
              props`opts`,
              (validLangs, opts) => (
                validLangs[opts.lang] ? opts.lang : 'en'
              )
            )
          }
        }
      ],
      query: true
    })
  }
})
```
