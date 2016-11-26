---
title: ch10. Routing
---

## Routing

**Load up chapter 10** - [Preview](10)

Now that our tutorial UI gets more complex it is a good idea to separate it a little bit. We want a home tab and a repos tab. Our two repos should load when we click the repos tab or hit the url directly.

Let us introduce the tabs first. We will just shove everything into our one component. Normally you would split this up into multiple components of course. You would probably also use JavaScript to map over a list of tabs or something similar, but let us be explicit now. Please change *./src/components/App/index.js* to:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import Toast from '../Toast'

export default connect({
  title: 'title',
  subTitle: 'subTitle',
  repos: 'repos',
  activeTab: 'activeTab'
}, {
  homeRouted: 'homeRouted',
  reposRouted: 'reposRouted'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <div className="c-tabs">
          <div className="c-tabs__headings">
            <div
              onClick={(event) => props.homeRouted()}
              className={`c-tab-heading ${props.activeTab === 'home' ? 'c-tab-heading--active' : ''}`}
            >
              Home
            </div>
            <div
              onClick={(event) => props.reposRouted()}
              className={`c-tab-heading ${props.activeTab === 'repos' ? 'c-tab-heading--active' : ''}`}
            >
              Repos
            </div>
          </div>
          <br />
          <div className={'c-tabs__tab' + (props.activeTab === 'home' ? 'c-tabs__tab--active' : '')}>
            <h5>Home page content</h5>
          </div>
          <div className={'c-tabs__tab' + (props.activeTab === 'repos' ? 'c-tabs__tab--active' : '')}>
            <ul>
              {Object.keys(props.repos).map((repoKey, index) => (
                <li key={index}>
                  {props.repos[repoKey].name} ({props.repos[repoKey].stargazers_count})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Toast />
      </div>
    )
  }
)
```

We also need to add new state in *./src/index.js*:
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
  homeRouted: [
    set(state`activeTab`, 'home')
  ],
  reposRouted: [
    set(state`activeTab`, 'repos'),
    [
      ...showToast('Loading data for repos...', 2000),
      getRepo('cerebral'), {
        success: [set(state`repos.cerebral`, input`data`)],
        error: []
      },
      getRepo('addressbar'), {
        success: [set(state`repos.addressbar`, input`data`)],
        error: []
      }
    ],
    ...showToast('Repos loaded', 2000, 'success')
  ]
}
...
```
Now you can testdrive your changes. You should see the first tab activated. Now go to debugger and change *activeTab* state to 'repos' and you will see the second tab. If you click the tabs you will actually trigger the signals which appears in the debugger. Nice! But what has this to do with Routing?

Traditional routers is a wrapper around your components and they manipulate what components to display based on the url. That is not how routing works in Cerebral. In Cerebral you connect urls to signals. So:

1. A url is hit or changed
2. The respective signal is triggered putting your application in the correct state
3. The components now renders based on the state of the application

This is a really good thing because most route changes requires quite a few state changes and side effects, like server requests, to be run. This is exactly what signals do so well.

Let us introduce **cerebral-router** to our project by adding an import to the top of our *./src/index.js*:

```js
import Router from 'cerebral-router'

```

And go ahead by doing the router config as follows inside the controller:
```js
...
const controller = Controller({
  devtools: Devtools(),
  router: Router({
    routes: {
      '/': 'homeRouted',
      '/repos': 'reposRouted'
    },
    onlyHash: true // Use hash urls
  })
  ...
})
...
```

As you can see, defining *routes* is as easy as linking them to *signals*. Now go to your browsers addressbar and enter *localhost/#/repos* and voilà the reposRouted signal gets called. And it also works the other way around. When you now click your tabs the url will also update!

### Challenge

Go to your browsers addressbar and enter an invalid route like: localhost/#/*foo* and press Enter. Now check the console! The challenge is to add another route which catches those *unknown* routes, runs a signal and display a toast with an error.

**Want to dive deeper?** - [Go in depth](../in-depth/12_routing.html), or move on with the tutorial
