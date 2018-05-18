# Routing

If you are not familiar with how Cerebral does its routing we can start off by telling you that it is different than traditional routing. Traditional routers map url changes to views/components. The Cerebral router maps urls to sequences. So, why change the behaviour?

Every event in your application triggers a sequence that normally leads to one or multiple state changes. This is not special to Cerebral, this is how all applications work. A url change is also an event in your application, just like a button click or a websocket message. In Cerebral you treat URL changes the same way as any other event in your application, with a sequence. The router does not affect your view/components layer at all. The benefit of this approach is consistency and flexibility. You can make a url change be anything you want.

## Adding the router

The router is its own package, **@cerebral/router**. You instantiate it simply by adding it to a modules file which is attached to your main module:

*main/modules.js*
```js
import { sequences } from 'cerebral/proxy'
import Router from '@cerebral/router'

export const router = Router({
  routes: [
    {
      path: '/',
      sequence: sequences.openMainPage
    }
  ]
})
```

*main/index.js*
```js
import { Module } from 'cerebral'
import * as modules from './modules'

export default Module({
  modules
})
```

This means that when the root url is hit the sequence **openMainPage** will trigger.

## Simple page transitions

Let us imagine that our application has 2 pages:

*main/index.js*

```js
import { sequences } from 'cerebral/proxy'
import Router from '@cerebral/router'

export const router = Router({
  routes: [
    {
      path: '/',
      sequence: sequences.openMainPage
    },
    {
      path: '/items',
      sequence: sequences.openItemsPage
    }
  ]
})
```

How do we make our components render each page? Well, first of all we need a state that tells our components what page to display. Let us also add the two sequence which will set the correct page:

*main/sequences.js*

```js
import { set } from 'cerebral/factories'
import { state } from 'cerebral/proxy'

export const openMainPage = set(state.currentPage, 'home')

export const openItemsPage = set(state.currentPage, 'items')
```

We now have state that represents what page we are on, let us use it in a component to display the correct page:

*components/App/index.js*

```js
import React from 'react'
import { connect } from 'cerebral/react'
import { state } from 'cerebral/proxy'

import Home from './Home'
import Items from './Items'

const pages = {
  home: Home,
  items: Items
}

export default connect(
  {
    currentPage: state.currentPage
  },
  function App({ currentPage }) {
    const Page = pages[currentPage]

    return (
      <div>
        <Page />
      </div>
    )
  }
)
```

The url triggers an event, which triggers a sequence, which sets the application in the correct state. The components now update and renders based on the current state of the application. With Cerebral you think about url changes as any other event in your application.

## Loading data on url change

The great thing about urls firing off sequences is that you can run any side effect you need, also deciding when the page change actually occurs. Lets say the items page needed to grab the items to be listed. We add a couple of new states related to this and update our sequence:

*main/sequences.js*

```js
import { set } from 'cerebral/factories'
import { httpGet } from '@cerebral/http/factories'
import { state } from 'cerebral/proxy'


export const openMainPage = set(state.currentPage, 'home')

export const openItemsPage = [
  set(state.currentPage, 'items'),
  set(state.isLoadingItems, true),
  httpGet('/items'),
  set(state.items, props.response.result),
  set(state.isLoadingItems, false)
]
```

So now we change the page immediately and we indicate that we are loading the items before getting them. But we could flip this around:

*main/sequences.js*

```js
import { set } from 'cerebral/factories'
import { httpGet } from '@cerebral/http/factories'
import { state } from 'cerebral/proxy'


export const openMainPage = set(state.currentPage, 'home')

export const openItemsPage = [
  set(state.isLoadingPageData, true),
  httpGet('/items'),
  set(state.items, props.response.result),
  set(state.isLoadingPageData, false),
  set(state.currentPage, 'items')
]
```

Now we rather indicate with a state that we are preparing some data for a page. This could for example show a progress animation at the top of the page, typically what you see on Youtube and linkedIn. When the data is ready, the page is changed.

This already shows you the flexibility of treating url changes as events in your app instead of making it part of your component tree.

## Dry up code with factories

Factories is an important concept in Cerebral and we can clean up our code a little bit:

*main/factories.js*

```js
import { state } from 'cerebral/proxy'

export function changePage(page, continueSequence = []) {
  return [
    set(state.currentPage, page),
    continueSequence
  ]
}
```

*main/sequences.js*

```js
import { set } from 'cerebral/factories'
import { httpGet } from '@cerebral/http/factories'
import { state } from 'cerebral/proxy'
import * as factories from './factories'


export const openMainPage = factories.changePage('home')

export const openItemsPage = factories.changePage('items', [
  set(state.isLoadingItems, true),
  httpGet('/items'),
  set(state.items, props.response.result),
  set(state.isLoadingItems, false)
])
```


We have now created a factory that allows us to define what page to change to. We did not clean up a lot here, but the **changePage** factory might do many different things related to moving from one page to an other.

## Initial data

We have already looked at how to load data on a specific url event, the **/items** url, where we load the items. But sometimes you want to load some initial data no matter what url is triggered. We could implement this logic into **changePage** like this:

*main/factories.js*

```js
import { set, when } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'
import { httpGet } from '@cerebral/http/factories'

function changePage(page, continueSequence = []) {
  return [
    set(state.currentPage, page),
    when(state.hasLoadedInitialData),
    {
      true: continueSequence,
      false: [
        httpGet('/initialdata'),
        set(state.initialData, props.response.result),
        set(state.hasLoadedInitialData, true),
        continueSequence
      ]
    }
  ]
}

export default changePage
```

But you might not want to load initial data on all page changes. Maybe you have a welcome page, or an about page. Going directly to those should not load the initial data. To solve it you would just create a separate factory for it:

*main/sequences.js*

```js
import { set } from 'cerebral/factories'
import { httpGet } from '@cerebral/http/factories'
import { state } from 'cerebral/proxy'
import * as factories from './factories'


export const openMainPage = factories.changePage('home')

export const openItemsPage = factories.changePage('items',
  factories.withInitialData([
    set(state.isLoadingItems, true),
    httpGet('/items'),
    set(state.items, props.response.result),
    set(state.isLoadingItems, false)
  ])
)
```

## Authentication

In our simple application we want the user to be authenticated only when moving to **/items**.

*main/sequences.js*

```js
import { set } from 'cerebral/factories'
import { httpGet } from '@cerebral/http/factories'
import { state } from 'cerebral/proxy'
import * as factories from './factories'


export const openMainPage = factories.changePage('home')

export const openItemsPage = factories.authenticate(
  factories.changePage('items',
    factories.withInitialData([
      set(state.isLoadingItems, true),
      httpGet('/items'),
      set(state.items, props.response.result),
      set(state.isLoadingItems, false)
    ])
  )
)
```

As you can see we again use a factory, only we wrap **changePage**. That way we do not even change the page if the authentication fails. The authenticate factory could look something like this:

*factories.js*

```js
import { set, when } from 'cerebral/factories'
import { redirect } from '@cerebral/router/factories'
import { state } from 'cerebral/proxy'

export function authenticate(continueSequence) {
  return [
    when(state.user),
    {
      true: continueSequence,
      false: redirect('/')
    }
  ]
}
```

We just check to see if we have a user and continue the sequence if we do. If not, we redirect back to front page. This is of course simplified and you might do lots of different things here, but the point is that you can easily compose this factory into whatever sequence you want to prevent it from moving on when the user is not authenticated.

## Nested routes

So what if we wanted to bind a route to show a single item? The single item is not a page by its own, it is a modal inside our **items** page. The way we solve this is simply by composing. We run the same logic as opening the **items** and then we add the logic for opening a single item:

*main/sequences.js*

```js
import { set } from 'cerebral/factories'
import { httpGet } from '@cerebral/http/factories'
import { state, props } from 'cerebral/proxy'
import { string } from 'cerebral/tags'
import * as factories from './factories'


export const openMainPage = factories.changePage('home')

export const openItemsPage = factories.changePage('items', [
  set(state.isLoadingItems, true),
  httpGet('/items'),
  set(state.items, props.response.result),
  set(state.isLoadingItems, false)
])

export const openItemPage = [
  openItemsPage,
  set(state.isLoadingItem, true),
  httpGet(string`/items/${props.id}`),
  set(state.items[props.id], props.response.result),
  set(state.currentItemId, props.id),
  set(state.isLoadingItem, false)
]
```

*main/modules.js*

```js
import Router from '@cerebral/router'
import { sequences } from 'cerebral/proxy'

export const router = Router({
  routes: [
    {
      path: '/',
      sequence: sequences.openMainPage
    },
    {
      path: '/items',
      sequence: sequences.openItemsPage
    },
    {
      path: '/items/:id',
      sequence: sequences.openItemPage
    }
  ]
})
```

There are thousands of way to handle urls, related side effects and UI. The Cerebral router gives you freedom to compose how all this fits together without constraints. It is up to you to build your “lego blocks” and put them together in a way that makes sense for your application.

## Animate transitions

So a fancy feature of routing is to transition one route to the next with an animation. This is not integrated into the Cerebral router, because there is no need to. You would handle this like any state transition. For example with a React Transition Group we could change our **App** component to animate between the pages instead:

_App.js_

```jsx
import React from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { connect } from 'cerebral/react'
import { state } from 'cerebral/proxy'

import Home from './Home'
import Items from './Items'

const pages = {
  home: Home,
  items: Items
}

export default connect(
  {
    currentPage: state.currentPage
  },
  function App({ currentPage }) {
    const Page = pages[currentPage]

    return (
      <div>
        <CSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          <Page />
        </CSSTransitionGroup>
      </div>
    )
  }
)
```

There really is nothing more to it.

## Summary

In this article we looked into what a simple, yet powerful concept the Cerebral Router is. You map urls to signals and compose these signals in a way that makes sense for your application. When mapping to a signal you are free to run any state changes and side effects needed to resolve the url. Animations are introduced in the components like any other state change. The concept of factories allows you to compose together pieces of logic, even into new factories. No matter how complex this composition becomes it will all be displayed as one coherent flow in the debugger.
