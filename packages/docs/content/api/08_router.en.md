---
title: Router
---

## Router

### Instantiate
```js
import {Controller} from 'cerebral'
import Router from 'cerebral/router'

const controller = Controller({
  router: Router({
    routes: {}, // Route definitions
    query: false, // Query support
    onlyHash: false, // Use hash urls
    baseUrl: '/' // Only handle url changes on nested path
  })
})
```

### Define routes
```js
import {Controller} from 'cerebral'
import Router from 'cerebral/router'

const controller = Controller({
  router: Router({
    routes: {
      '/': 'home.routed',
      '/posts': 'posts.routed'
    }
  })
})
```

### Dynamic routes
```js
import {Controller} from 'cerebral'
import Router from 'cerebral/router'

const controller = Controller({
  router: Router({
    routes: {
      '/': 'home.routed',
      '/posts': 'posts.routed',
      '/posts/:id': 'posts.post.routed'
    }
  })
})
```

### Nested routes
```js
import {Controller} from 'cerebral'
import Router from 'cerebral/router'

const controller = Controller({
  router: Router({
    routes: {
      '/': 'home.routed',
      '/posts': {
        '/': 'posts.routed',
        '/:id': 'posts.post.routed'
      }
    }
  })
})
```
