# Routing

If you are not familiar with how Cerebral does its routing we can start off by telling you that it is different than traditional routing. Traditional routers map url changes to views/components. The Cerebral router maps urls to signals. So, why change the behaviour?

Every event in your application triggers a signal that normally leads to one or multiple state changes. This is not special to Cerebral, this is how all applications work. A url change is also an event in your application, just like a button click or a websocket message. In Cerebral you treat URL changes the same way as any other event in your application, with a signal. The router does not affect your view/components layer at all. The benefit of this approach is consistency and flexibility. You can make a url change be anything you want.

## Adding the router

The router is its own package, **@cerebral/router**. You instantiate it simply by adding it to the root Cerebral module:

*app/index.js*
```js
import {Module} from 'cerebral'
import Router from '@cerebral/router'

const router = Router({
  routes: [{
    path: '/',
    signal: 'rootRouted' 
  }]
})

export default Module({
  modules: {router}
})
```

This means that when the root url is hit the signal **rootRouted** will trigger.

## Simple page transitions

Let us imagine that our application has 2 pages:

*app/index.js*
```js
import {Module} from 'cerebral'
import Router from 'cerebral-router'

const router = Router({
  routes: [{
    path: '/',
    signal: 'rootRouted'
  }, {
    path: '/items',
    signal: 'itemsRouted'
  }]
})

export default Module({
  modules: {router}
})
```

How do we make our components render each page? Well, first of all we need a state that tells our components what page to display. Let us also add the two signals which will set the correct page:

*app/index.js*
```js
import {Module} from 'cerebral'
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import router from './router'

export default Module({
  modules: {router},
  state: {
    currentPage: 'home'
  },
  signals: {
    homeRouted: set(state`currentPage`, 'home'),
    itemsRouted: set(state`currentPage`, 'items')
  }
})
```

As you can see we moved the router to its own file, this is recommended. We now have state that represents what page we are on, let us use it in a component to display the correct page:

*App.js*
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

import Home from './Home'
import Items from './Items'

const pages = {
  home: Home,
  items: Items
}

export default connect({
  currentPage: state`currentPage`
},
  function App ({currentPage}) {
    const Page = pages[currentPage]
    
    return (
      <div>
        <Page />
      </div>
    )
  }
)
```

The url triggers an event, which triggers a signal, which sets the application in the correct state. The components now update and renders based on the current state of the application. With Cerebral you think about url changes as any other event in your application.

## Loading data on url change

The great thing about urls firing off signals is that you can run any side effect you need, also deciding when the page change actually occurs. Lets say the items page needed to grab the items to be listed. We add a couple of new states related to this and update our signal:

*app/index.js*
```js
import {Module} from 'cerebral'
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import HttpProvider, {httpGet} from '@cerebral/http/operators'
import router from './router'

export default Module({
  modules: {router},
  providers: {
    http: HttpProvider()
  },
  state: {
    currentPage: 'home',
    items: [],
    isLoadingItems: false
  },
  signals: {
    homeRouted: set(state`currentPage`, 'home'),
    itemsRouted: [
      set(state`currentPage`, 'items'),
      set(state`isLoadingItems`, true),
      httpGet('/items'),
      set(state`items`, props`result`),
      set(state`isLoadingItems`, false)
    ]
  }
})
```

So now we change the page immediately and we indicate that we are loading the items before getting them. But we could flip this around:

*app/index.js*
```js
import {Module} from 'cerebral'
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import HttpProvider, {httpGet} from '@cerebral/http/operators'
import router from './router'

export default Module({
  modules: {router},
  providers: {
    http: HttpProvider()
  },
  state: {
    currentPage: 'home',
    items: [],
    isLoadingPageData: false
  },
  signals: {
    homeRouted: set(state`currentPage`, 'home'),
    itemsRouted: [
      set(state`isLoadingPageData`, true),
      httpGet('/items'),
      set(state`items`, props`result`),
      set(state`isLoadingPageData`, false),
      set(state`currentPage`, 'items')
    ]
  }
})
```

Now we rather indicate with a state that we are preparing some data for a page. This could for example show a progress animation at the top of the page, typically what you see on Youtube and linkedIn. When the data is ready, the page is changed.

This already shows you the flexibility of treating url changes as events in your app instead of making it part of your component tree.

## Dry up code with factories

Factories is an important concept in Cerebral and we can clean up our code a little bit:

*app/index.js*
```js
import {Module} from 'cerebral'
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import HttpProvider, {httpGet} from '@cerebral/http/operators'
import router from './router'

function changePage (page, continueSequence = []) {
  return [
    set(state`currentPage`, page),
    continueSequence
  ]
}

export default Module({
  modules: {router},
  providers: {
    http: HttpProvider()
  },
  state: {
    currentPage: 'home',
    items: [],
    isLoadingItems: false
  },
  signals: {
    homeRouted: changePage('home'),
    itemsRouted: changePage('items', [
      set(state`isLoadingItems`, true),
      httpGet('/items'),
      set(state`items`, props`result`),
      set(state`isLoadingItems`, false)
    ])
  }
})
```

We have now created a factory that allows us to define what page to change to. We did not clean up a lot here, but the **changePage** factory might do many different things related to moving from one page to an other.

## Initial data

We have already looked at how to load data on a specific url event, the **/items** url, where we load the items. But sometimes you want to load some initial data no matter what url is triggered. We could implement this logic into **changePage** like this:

*changePage.js*
```js
import {set, when} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import {httpGet} from '@cerebral/http/operators'

function changePage (page, continueSequence = []) {
  return [
    set(state`currentPage`, page),
    when(state`hasLoadedInitialData`), {
      'true': continueSequence,
      'false': [
        httpGet('/initialdata'),
        set(state`initialData`, props`result`),
        set(state`hasLoadedInitialData`, true),
        continueSequence
      ]
    }
  ]
}

export default changePage
```

But you might not want to load initial data on all page changes. Maybe you have a welcome page, or an about page. Going directly to those should not load the initial data. To solve it you would just create a separate factory for it:

*app/index.js*
```js
import {Module} from 'cerebral'
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import HttpProvider, {httpGet} from '@cerebral/http/operators'
import router from './router'
import changePage from './factories/changePage'
import withInitialData from './factories/withInitialData'
import itemsRouted from './signals/itemsRouted'

export default Module({
  modules: {router},
  providers: {
    http: HttpProvider()
  },
  state: {
    currentPage: 'home',
    items: [],
    isLoadingItems: false,
    hasInitialData: false,
    initialData: null
  },
  signals: {
    homeRouted: changePage('home'),
    itemsRouted: changePage('items', withInitialData(itemsRouted))
  }
})
```

## Authentication

In our simple application we want the user to be authenticated only when moving to **/items**.

*app/index.js*
```js
import {Module} from 'cerebral'
import router from './router'
import HttpProvider from '@cerebral/http/operators'
import changePage from './factories/changePage'
import authenticate from './factories/authenticate'
import itemsRouted from './signals/itemsRouted'

export default Module({
  modules: {router},
  providers: {
    http: HttpProvider()
  },
  state: {
    user: null,
    currentPage: 'home',
    items: [],
    isLoadingItems: false
  },
  signals: {
    homeRouted: changePage('home'),
    itemsRouted: authenticate(changePage('items', itemsRouted))
  }
})
```

As you can see we again use a factory, only we wrap **changePage**. That way we do not even change the page if the authentication fails. The authenticate factory could look something like this:

*authenticate.js*
```js
import {set, when} from 'cerebral/operators'
import {redirect} from '@cerebral/router/operators'
import {state} from 'cerebral/tags'

function authenticate (continueSequence) {
  return [
    when(state`user`), {
      'true': continueSequence,
      'false': redirect('/')
    }
  ]
}

export default authenticate
```

We just check to see if we have a user and continue the sequence of actions if we do. If not, we redirect back to front page. This is of course simplified and you might do lots of different things here, but the point is that you can easily compose this factory into whatever signal you want to prevent it from moving on when the user is not authenticated.

## Nested routes

So what if we wanted to bind a route to show a single item? The single item is not a page by its own, it is a modal inside our **items** page. The way we solve this is simply by composing. We run the same logic as opening the **items** and then we add the logic for opening a single item:

*app/index.js*
```js
import {Module} from 'cerebral'
import router from './router'
import HttpProvider from '@cerebral/http'
import changePage from './factories/changePage'
import authenticate from './factories/authenticate'
import itemsRouted from './signals/itemsRouted'
import itemRouted from './signals/itemRouted'

export default Module({
  modules: {router},
  providers: {
    http: HttpProvider()
  },
  state: {
    user: null,
    currentPage: 'home',
    items: [],
    isLoadingItems: false,
    isLoadingItem: false,
    currentItemId: null
  },
  signals: {
    homeRouted: changePage('home'),
    itemsRouted: authenticate(changePage('items', itemsRouted)),
    itemRouted: authenticate(changePage('items', [itemsRouted, itemRouted]))
  }
})
```

*router.js*
```js
import Router from '@cerebral/router'

export default Router({
  routes: [{
    path: '/',
    signal: 'rootRouted'
  }, {
    path: '/items',
    signal: 'itemsRouted'
  }, {
    path: '/items/:id',
    signal: 'itemRouted'
  }]
})
```

There are thousands of way to handle urls, related side effects and UI. The Cerebral router gives you freedom to compose how all this fits together without constraints. It is up to you to build your “lego blocks” and put them together in a way that makes sense for your application.

## Animate transitions

So a fancy feature of routing is to transition one route to the next with an animation. This is not integrated into the Cerebral router, because there is no need to. You would handle this like any state transition. For example with a React Transition Group we could change our **App** component to animate between the pages instead:

*App.js*
```jsx
import React from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

import Home from './Home'
import Items from './Items'

const pages = {
  home: Home,
  items: Items
}

export default connect({
  currentPage: state`currentPage`
},
  function App ({currentPage}) {
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
