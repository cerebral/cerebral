---
title: Refactoring using Modules
---

## 16: Refactoring using Modules

`npm run ch15`

Glad you are still with us! Hopefully you have enjoyed our journey so far and hopefully you still have a sip left of your coffee or drink.
It's time for cleaning up. After already cleaning up the UI a little bit for the User it is time to make life easier as well for us developers.
Welcome to the world of **Modules**
We will build the following structure:

```
.
├── public
|	├── index.html
|	└── ...
├── src
|	├── components
|	|	├── HeaderButton
|	|	├── ...
|	|	├── ...	
|	├── computeds	
|	|	├── getStars
|	|	├── ...
|	├── modules	
|	|	├── app
|	|	├── github
|	|	├── stateandaction
|	└── index.js
├── package.json
├── ...
```

So do a final `npm run ch16` to pull in the final result!

Our *./src/index.js* looks now much cleaner:
```js
import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import HttpProvider from 'cerebral-provider-http'
import { ContextProvider } from 'cerebral/providers'
import logger from 'js-logger'
import Router from 'cerebral-router'
import AppModule from './modules/app'
import StateAndActionModule from './modules/stateandaction'
import GitHubModule from './modules/github'

logger.useDefaults()

const controller = Controller(
  {
    modules: {
      app: AppModule,
      sas: StateAndActionModule,
      github: GitHubModule
    },

    devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
    providers: [
      HttpProvider({
        baseUrl: 'https://api.github.com'
      }),
      ContextProvider({
        logger})
    ],
    router: Router({
      routes: {
        '/': 'app.stateAndActionsRouted',
        '/github': 'app.gitHubRouted',
        '/*': 'app.unknownRouted'
      },
      onlyHash: true // Use hash urls
    })

  })

render((
  <Container controller={controller}>
    <App />
  </Container>
  ), document.querySelector('#root'))

```

As an example, the AppModule looks like:

```js
import { set, state } from 'cerebral/operators'

export default {
  state: {toast: {
    messages: []
  },
    activeTab: 'StateAndActions'
  },
  signals: {
    stateAndActionsRouted: [
      set(state`app.activeTab`, 'StateAndActions')
    ],
    gitHubRouted: [
      set(state`app.activeTab`, 'Github')
    ],
    unknownRouted: [
      set(state`app.activeTab`, 'StateAndActions')
    ]
  },
  modules: {}
}
```

So you can see that we can nicely separate now *state* and *signals* into modules.
And since this module gets pulled into our *Controller* in *./src/index.js* as **app**: AppModule we need to prefix all *state-paths* and *signal-names* in our operators,actions,components and computeds with **app.** as well.

So there is no magic in **Modules** (and again, that is a good thing). It's all about namespacing *Signals* and *State* but that helps a lot to structure your Application.

Congratulations! You have reached the end of our *Get Started* - tutorial.
There is a lot of other good stuff on this website. So please check it out!

There is a **last challenge** though: Build your next big thing with **Cerebral** and tell all your friends about it! :)