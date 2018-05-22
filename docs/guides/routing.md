# Routing

There are two different way to do routing. You can do the routing inside your view layer or you can treat url changes like any other event in your application. In this guide we will look at how you can do a "Cerebral first" approach to routing, but also generally about how to compose sequences to manage routing.

## Cerebral first router

By installing [page.js](https://www.npmjs.com/package/page) you can implement a router that triggers a sequence when the url changes. This can be done making your main module  a module factory:

```js
import page from 'page'
import { routeToRoot, routeToItems, routeToItem } from './sequences'

export default ({ app }) => {

  app.on('initialized', () => page.start())

  function route(url, sequence) {
      page(url, (context) => app.runSequence(url, sequence, context.params))

      return ({ props }) => page.show(Object.keys(props).reduce((currentUrl, param) => {
        return currentUrl.replace(`:${param}`, props[param])
      }, url))
  }

  return {
    sequences: {
      routeToRoot: route('/', routeToRoot),
      routeToItems: route('/items', routeToItems),
      routeToItem: route('/items/:id', routeToItem)
    }
  }
}
```

With this approach you trigger url changes with hyperlinks or you can call the sequences directly, which redirects to the url in question.