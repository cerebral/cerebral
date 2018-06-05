# Routing

There are two different way to do routing. You can do the routing inside your view layer or you can treat url changes like any other event in your application. In this guide we will look at how you can do a "Cerebral first" approach to routing, but also generally about how to compose sequences to manage routing.

## Cerebral first router

By installing [page.js](https://www.npmjs.com/package/page) you can implement a router that triggers a sequence when the url changes. This can be done making your main module a module factory:

```js
import page from 'page'
import { routeToRoot, routeToItems, routeToItem } from './sequences'

export default ({ app }) => {

  // We want to start the router when the app is initialized
  app.on('initialized', () => page.start())

  // We create a route factory which takes the route url and
  // the sequences that should run when it triggers. It does two things
  // 
  //  1. It register the route to page.js which runs the sequence using the
  //     path as the name of the execution, the sequence and passes in any
  //     params
  // 
  //  2. It returns an action that you can run from your views, mapping
  //     the "props.params" passed in into the related url. Then triggers
  //     the url
  function route(url, sequence) {
      page(url, ({ path, params }) => app.runSequence(path, sequence, { params }))

      return ({ props }) => {
        const urlWithReplacedParams = Object.keys(props.params || {}).reduce((currentUrl, param) => {
          return currentUrl.replace(`:${param}`, props.params[param])
        }, url)

        page.show(urlWithReplacedParams)
      }
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

```js
import { connect } from '@cerebral/react'
import { sequences } from 'cerebral'

export default connect(
  function MyComponent ({ get }) {
    const routeToItem = get(sequences.routeToItem)

    return (
      <button
        onClick={() => routeToItem({ params: { id: 123 }})}
      >
        Go to 123
      </button>
    )
  }
)
```

## Query strings

Not all applications has query strings, but if you need them you can easily add them by `npm install query-string`. There are several ways to manage this and in this example we will add another prop that has the parsed query string:

```js
import page from 'page'
import qs from 'query-string'
import { routeToRoot, routeToItems, routeToItem } from './sequences'

export default ({ app }) => {

  app.on('initialized', () => page.start())

  function route(url, sequence) {
      page(url, ({ path, params, querystring }) => {
        // We parse the querystring passed in by page.js and pass it to the sequence
        // on the "query" prop
        const query = qs.parse(querystring)

        app.runSequence(path, sequence, { params, query })
      })

      return ({ props }) => {
        const urlWithReplacedParams = Object.keys(props.params || {}).reduce((currentUrl, param) => {
          return currentUrl.replace(`:${param}`, props.params[param])
        }, url)
        // We stringify any query passed in when the sequence is executed from the
        // view
        const query = props.query ? '?' + qs.stringify(props.query) : ''

        page.show(urlWithReplacedParams + query)
      }
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

Again you just use the query property in a component to add them to the url:

```js
import { connect } from '@cerebral/react'
import { sequences } from 'cerebral'

export default connect(
  function MyComponent ({ get }) {
    const routeToItems = get(sequences.routeToItems)

    return (
      <button
        onClick={() => routeToItems({ query: { limit: 10 }})}
      >
        Go to items
      </button>
    )
  }
)
```

You might not want to use a **params** and **query** property, but rather extract props to params first and then any leftover props is put on the query. This requires a bit more code and you are perfectly free to do that. This is also a good start for a module that can be shared with others if you get inspired and want to maintain a Cerebral router!

## Managing nested routes

When you have two routes of for example `/items` and `/items/:id` you might want to run the logic for the first route when the second is triggered. The reason can be that you show a page with items and the id is what indicates the modal that should be displayed on top of that list. The two routes are defined separately:

```js
{
  sequences: {
    routeToRoot: route('/', routeToRoot),
    routeToItems: route('/items', routeToItems),
    routeToItem: route('/items/:id', routeToItem)
  }
}
```

The way we would make sure that the items logic runs as well when `/items/:id` is triggered is just to compose it. In the `sequences.js` file of the module:

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'
import * as actions from './actions'

export const routeToRoot = set(state.page, 'home')

export const routeToItems = [
  set(state.page, 'items'),
  actions.getItems,
  set(state.items, props.items)
]

export const routeToItem = [
  routeToItems, // We just add the sequence
  actions.getItemDetails,
  set(state.itemDetails[props.id], props.itemDetails),
  set(state.currentItemId, props.id)
]
```

In this situation it will go an grab the items first and then it will go and grab the single item details. We could improve this by running them in parallel:

```js
import { parallel, set } from 'cerebral/factories'
import { state, props } from 'cerebral'
import * as actions from './actions'

export const routeToRoot = set(state.page, 'home')

export const routeToItems = [
  set(state.page, 'items'),
  actions.getItems,
  set(state.items, props.items)
]

export const routeToItem = parallel([
  routeToItems,
  [
    actions.getItemDetails,
    set(state.itemDetails[props.id], props.itemDetails),
    set(state.currentItemId, props.id)
  ]
])
```

Now we are instantly setting the page, though the items in the background might be populated after the item details is downloaded and set. How you compose this together most effectively depends on the data and the user experience you want to create. The sequences is a powerful tool to handle these kinds of compositions.