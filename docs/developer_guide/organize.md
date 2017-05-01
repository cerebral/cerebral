# Organize

Cerebral uses a concept called **modules** to organize application code. These allow you to wrap state and signals into a namespace without isolating them. Any action run in a signal can change any state in the application.

Typically the file structure for modules looks like this. We call it the **signals pattern**. Every signal has its own file.

```js
/modules
  /home
    /actions
    /signals
    index.js
main.js
```

The **index.js** file is where you define the module. It is just an object where you can define state, signals and optionally sub modules.

```js
import somethingHappened from './signals/somethingHappened'

export default {
  state: {},
  signals: {
    somethingHappened
  }
}
```

You are free to structure however you want of course. Maybe you rather want to define signals directly in *index.js*, rather than have each one contained in a file.

In the **controller.js** file, the module is added to the controller:

```js
import {Controller} from 'cerebral'
import home from './modules/home'

const controller = Controller({
  modules: {
    home
  }
})
```

Any signal and state defined inside the *home* module will live on the namespace chosen during controller instantiation.

And this is how an application scales: by defining modules and submodules. Actions and factories that are common are often placed in a folder called **common**:

```js
/common
  /actions
  /factories
/modules
  /home
    /actions
    /signals
    index.js
main.js
```

## Components

A very important point in Cerebral is that your components do not affect the structure of the application state. Modules are defined in terms of what makes sense for state and signals. Sometimes this is similar to how components are structured, but more often it is not. This is why components usually live in their own **components** folder, separated from the modules:

```js
/components
  /Home
    index.js
/common
  /actions
  /factories
/modules
  /home
    /actions
    /signals
    index.js
main.js
```

And this is it. You will never get in trouble creating a module because any action can change any state in your application. Modules are just a way to structure state and signals, not isolate them.

## Tutorial

Before we begin you can have a look at [the solution over here](https://www.webpackbin.com/bins/-KfDKApROapTmuhEF5_j). Click the **download** button, which downloads the project as a Webpack project, extract the contents to a folder on your computer and make sure that you have installed [Node JS](https://nodejs.org/en/). From the command line, run:

`npm install`

Then you can run:

`npm start`

Go to *localhost:3000* in your browser. Now you have a starting point for playing more with Cerebral and make the final adjustments yourself. A new Webpack loader called **CSS Modules** has been added and also the **classnames** tool is ready to be used. These two features allows you to refactor the CSS of the application in a scalable way.

### Folder structure
SO! Welcome to the world of **modules**. We will build the following structure:
```
/src
  /components
    /App
      index.js
      styles.css
    /Home
      index.js
      styles.css
    /Repos
      index.js
      styles.css
    /Toast
      index.js
      styles.css

  /modules
    /app
      /factories
        showToast.js
      index.js
    /home
      /signals
        routed.js
      index.js
    /repos
      /factories
        getRepo.js
      /signals
        routed.js
      index.js

  /computed
    starsCount.js

  controller.js
  main.js
```

Let us do this step by step.

### main.js
Our main file should just wire things together, meaning that it wires the controller with the view.

```js
import React from 'react'
import {render} from 'react-dom'
import {Container} from 'cerebral/react'
import controller from './controller'
import App from './components/App'

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

### controller.js
Our controller does the same kind of wiring. It wires the modules of our app to the controller and its configuration.

```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import HttpProvider from 'cerebral-provider-http'
import app from './modules/app'
import home from './modules/home'
import repos from './modules/repos'

const controller = Controller({
  devtools: Devtools({
    remoteDebugger: '127.0.0.1:8585'
  }),
  modules: {
    app,
    home,
    repos,
    router: Router({
      routes: [
        {path: '/', signal: 'home.routed'},
        {path: '/repos', signal: 'repos.routed'}
      ],
      onlyHash: true
    })
  },
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    })
  ]
})
```

Basically our state and signals has been removed and we rather import modules instead.

### modules/app
The app module will take care of what tab is currently active, our titles and the toast.

*index.js*
```js
export default {
  state: {
    title: 'Cerebral Tutorial',
    subTitle: 'Routing',
    activeTab: 'home',
    toast: null
  }
}
```

It will also hold the **showToast** factory as we consider it a "global app thing", even though it is currently only used by the **repos** module.

*factories/showToast.js*
```js
import {set, merge, debounce} from 'cerebral/operators'
import {state} from 'cerebral/tags'

const toastDebounce = debounce.shared()
function showToast (message, ms, type = null) {
  if (!ms) {
    return merge(state`app.toast`, {message, type})
  }

  return [
    merge(state`app.toast`, {message, type}),
    toastDebounce(ms), {
      continue: [
        set(state`app.toast`, null)
      ],
      discard: []
    }
  ]
}

export default showToast
```

Note that the paths to the state has changed, since **toast** now is under the namespace **app**.

### modules/home
The home module does not have any state, but it does have a signal related to being clicked.

*index.js*
```js
import clicked from './signals/clicked'

export default {
  signals: {
    clicked
  }
}
```

*signals/clicked.js*
```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default set(state`app.activeTab`, 'home')
```

As you can see any signal can point to any state. This allows you to organize your app in a way that makes sense without worrying about isolation. This is really important, because in complex applications isolation causes big challenges.

### modules/repos
Our repos module holds the list of repos and also holds the signal for opening the repos tab.

*index.js*
```js
import clicked from './signals/clicked'

export default {
  state: {
    list: {}
  },
  signals: {
    clicked
  }
}
```

*signals/clicked.js*
```js
import {parallel} from 'cerebral'
import {set, when} from 'cerebral/operators'
import {state, props, string} from 'cerebral/tags'
import getRepo from '../factories/getRepo'
import showToast from '../../app/factories/showToast'
import starsCount from '../../computed/starsCount'

export default [
  set(state`app.activeTab`, 'repos'),
  showToast(string`Loading data for repos...`),
  parallel([
    getRepo('cerebral'),
    getRepo('addressbar')
  ]),
  when(props`error`), {
    'true': showToast(string`Error: ${props`error`}`, 5000, 'error'),
    'false': [
      set(state`repos.list.cerebral`, props`cerebral`),
      set(state`repos.list.addressbar`, props`addressbar`),
      showToast(string`The repos have ${starsCount} stars`, 5000, 'success')    
    ]
  }
]
```

*factories/getRepo.js*
```js
function getRepoFactory (repoName) {
  function getRepo ({http}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then((response) => {
        return {[repoName]: response.result}
      })
      .catch((response) => {
        return {error: response.error}
      })
  }

  return getRepo
}

export default getRepoFactory
```

This is a good example of how Cerebral works. Note that there are no imports to this action factory. You just write out the logic of it, cause the context is decoupled from the actual logic.

### components/App
We also need to split up our components a bit. The app component is now cleaned up a bit and it is using **CSS Modules** and the **classnames** tool.

*index.js*
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import styles from './styles.css'
import classnames from 'classnames'
import Toast from './Toast'
import Home from '../Home'
import Repos from '../Repos'

export default connect({
  title: state`app.title`,
  subTitle: state`app.subTitle`,
  activeTab: state`app.activeTab`,
  homeClicked: signal`home.clicked`,
  reposClicked: signal`repos.clicked`
},
  function App ({
    title,
    subTitle,
    activeTab,
    homeClicked,
    reposClicked
  }) {
    return (
      <div>
        <h1 className={styles.center}>{title}</h1>
        <h2 className={styles.center}>{subTitle}</h2>
        <div>
          <div className={styles.tabs}>
            <div
              onClick={() => homeClicked()}
              className={classnames(styles.tab, {
                [styles.activeTab]: activeTab === 'home'
              })}
            >
              Home
            </div>
            <div
              onClick={() => reposClicked()}
              className={classnames(styles.tab, {
                [styles.activeTab]: activeTab === 'repos'
              })}
            >
              Repos
            </div>
          </div>
          <br />
          {activeTab === 'home' ? <Home /> : null}
          {activeTab === 'repos' ? <Repos /> : null}
        </div>
        <Toast />
      </div>
    )
  }
)
```
Note here how css class names are actually being exported as a module to the component file. Allowing it to point to these classes with plain JavaScript. That is what css modules is all about and they are great for keeping you sane writing CSS in large applications. Lets look at how to refactor the css file:

*styles.css*
```css
.center {
  text-align: center;
}

.tabs {
  display: flex;
}

.tab {
  flex: 1;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  padding: 5px;
}

.activeTab {
  background-color: #0086b3;
  border-radius: 3px;
  color: #FFF;
}
```

### Finish the refactor
We have shown you the idea of the refactor here and now you can finish it. You need to refactor the following:

1. Home component and styles (if any)
2. Repos component and styles
3. starsCount computed

And some notes:

1. Remember to changes paths to signals and state, they are now namespaced. For example: **repos.list** instead of **repos**
2. There should not be any **styles.css** file linked to in **index.html**. All CSS should be related to a specific component

Congratulations! You have reached the end of our *Get Started* - tutorial.
There is a lot of other good stuff on this website. So please check it out!

When you are done with the refactor you can try to create a form input where on **onSubmit** it will fetch that repo and show its stars count. Remember to **preventDefault** on the form submit event! :)

Build your next big thing with **Cerebral** and please tell us about it on [discord chat](https://discord.gg/0kIweV4bd2bwwsvH) :)
