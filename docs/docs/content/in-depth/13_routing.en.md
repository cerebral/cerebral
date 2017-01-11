---
title: Routing
---

## Routing

Typically applications uses a router. To instantiate the Cerebral router you install it as a separate package:

`npm install cerebral-router@next --save`

Then you instantiate it on the controller:

```js
import {Controller} from 'cerebral'
import Router from 'cerebral-router'

const controller = Controller({
  router: Router({
    routes: {}, // Route definitions
    query: false, // Query support
    onlyHash: false, // Use hash urls
    baseUrl: '/' // Only handle url changes on nested path
  })
})
```

### Defining routes
Routes in Cerebral does not affect the components, they affect signals. The signals puts your application in a specific state and then your components decides what to render based on that state. So the router is completely decoupled from your components. This is a very good thing because a route can now translate to any kind of state changes and side effects.

Let us create a small app:

```js
import {Controller} from 'cerebral'
import Router from 'cerebral-router'
import HomeModule from './modules/Home'
import PostsModule from './modules/Posts'

const controller = Controller({
  router: Router({
    routes: {
      '/': 'home.routed',
      '/posts': 'posts.routed'
    }
  }),
  state: {
    currentPage: 'home'
  },
  modules: {
    home: HomeModule,
    posts: PostsModule
  }
})
```

As we can see, when the root route is hit we want to trigger a signal that says that home is routed:

*modules/Home/index.js*
```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default {
  signals: {
    routed: [
      set(state`currentPage`, 'home')
    ]
  }
}
```

The **/posts** route points to a different module and signal.

*modules/Posts/index.js*
```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default {
  signals: {
    routed: [
      set(state`currentPage`, 'posts')
    ]
  }
}
```

### Render based on state
So we do not render anything based on the route. We render based on state, like we do with everything else. A route never affects the components, it only affects your state.

*components/App/index.js*
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import Home from '../Home'
import Posts from '../Posts'

const pages = {
  home: Home,
  posts: Posts
}

export default Connect({
  currentPage: state`currentPage`
},
  function App(props) {
    const Page = pages[props.currentPage]

    return <Page />
  }
)
```

So this was simple page handling routing, but you can imagine that a route does not have to be a page change. It can opening a modal, highlight some item or whatever. You are completely free to structure this. If some data fetching was needed before changing the page you would just put this in the signal.
