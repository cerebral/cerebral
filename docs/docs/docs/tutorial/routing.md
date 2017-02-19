# Routing

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/#/bins/-KdBeIDJoRv0PQlF7uWU)

Now that our tutorial UI gets more complex it is a good idea to separate it a little bit. We want a home tab and a repos tab. Our two repos should load when we click the repos tab or hit the url directly.

## Adding some tabs
Let us introduce the tabs first. We will just shove everything into our one component. Normally you would split this up into multiple components of course. You would probably also use JavaScript to map over a list of tabs or something similar, but let us be explicit now. Please change *App.js* to:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import Toast from './Toast'

export default connect({
  title: state`title`,
  subTitle: state`subTitle`,
  repos: state`repos`,
  activeTab: state`activeTab`,
  homeClicked: signal`homeClicked`,
  reposClicked: signal`reposClicked`
},
  function App ({
    title,
    subTitle,
    repos,
    activeTab,
    homeClicked,
    reposClicked
  }) {
    return (
      <div>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
        <div>
          <div className='tabs'>
            <div
              onClick={() => homeClicked()}
              className={`tab ${
                activeTab === 'home' ? 'tab-active' : ''
              }`}
            >
              Home
            </div>
            <div
              onClick={() => reposClicked()}
              className={`tab ${
                activeTab === 'repos' ? 'tab-active' : ''
              }`}
            >
              Repos
            </div>
          </div>
          <br />
          {
            activeTab === 'home' ? (
              <div>
                Some awesome home page content
              </div>   
            ) : null
          }
          {
            activeTab === 'repos' ? (
              <div>
                <ul>
                  {Object.keys(repos).map((repoKey, index) => {
                    const name = repos[repoKey].name
                    const count = repos[repoKey].stargazers_count

                    return (
                      <li key={index}>
                        {name} ({count})
                      </li>
                    )
                  })}
               </ul>
              </div>   
            ) : null
          }
        </div>
        <Toast />
      </div>
    )
  }
)
```

We also need to add new state in *main.js*:
```js
...
{
  title: 'Hello from Cerebral!',
  subTitle: 'Working on my state management',
  toast: null,
  repos: {},
  activeTab: 'home'
}
...
```
And update the signals as well:
```js
...
{
  homeClicked: [
    set(state`activeTab`, 'home')
  ],
  reposClicked: [
    set(state`activeTab`, 'repos'),
    ...showToast(string`Loading data for repo: ${props`repo`}`),
    [
      getRepo('cerebral'),
      getRepo('addressbar')
    ],
    when(props`error`), {
      'true': [
        ...showToast(string`Error: ${props`error`}`, 5000, 'error')
      ],
      'false': [
        set(state`repos.cerebral`, props`cerebral`),
        set(state`repos.addressbar`, props`addressbar`),
        ...showToast(string`The repos have ${starsCount} stars`, 5000, 'success')    
      ]
    }
  ]
}
...
```
Now you can test-drive your changes. You should see the first tab activated. Now go to the debugger and change *activeTab* state to 'repos' and you will see the second tab. If you click the tabs you will actually trigger the signals which appear in the debugger. Nice! But what has this to do with Routing?

## Introducing the router
Traditional routers is a wrapper around your components and they manipulate what components to display based on the URL. That is not how routing works in Cerebral. In Cerebral you connect URLs to signals. So:

1. A URL is hit or changed
2. The respective signal is triggered putting your application in the correct state
3. The components now renders based on the state of the application

This is a really good thing because most route changes require quite a few state changes and side effects, like server requests, to be run. This is exactly what signals do so well.

Let us introduce **cerebral-router** to our project by adding an import to the top of our *./src/index.js*:

```js
import Router from 'cerebral-router'

```

And go ahead by doing the router config as follows inside the controller:
```js
...
const controller = Controller({
  ...
  modules: {
    router: Router({
      routes: [
        {path: '/', signal: 'homeClicked'},
        {path: '/repos', signal: 'reposClicked'}
      ],
      onlyHash: true
    })
  },
  ...
})
...
```

As you can see, defining *routes* is as easy as linking them to *signals*. When you save and load up the BIN again you can go to the addressbar and change the url to **/#/repos**. You will now see the signal triggers and the repos content is shown. This is exactly what happens when you click the tab as well.

## Challenge

Go to your browsers addressbar and enter an invalid route like: localhost/#/*foo* and press Enter. Now check the log! The challenge is to add another route which catches those *unknown* routes, runs a signal and display a toast with an error. You probably need to read some more docs on the router to make this work.
