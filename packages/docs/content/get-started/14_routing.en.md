---
title: Routing
---

## 14: Routing

`npm run ch13`

Now that our tutorial UI gets more complex it is a good idea to separate it a little bit.
Let us introduce some Tabs.
Please change *./src/components/App/index.js* to:
```js
import React from 'react'
import { connect } from 'cerebral/react'
import HeaderButton from '../HeaderButton'
import Toast from '../Toast'
import Input from '../Input'
import LoadDataInput from '../LoadDataInput'
import StarCountButton from '../StarCountButton'
export default connect({
  appTitle: 'appTitle',
  activeTab: 'activeTab'
}, {
  stateAndActions: 'stateAndActionsRouted',
  gitHub: 'gitHubRouted'
}, function App (props) {
  return (
    <div className='o-container o-container--medium'>
      <h1 className='u-high'>{props.appTitle}</h1>
      <div className='c-tabs'>
        <div className='c-tabs__headings'>
          <div onClick={(event) => props.stateAndActions()} className={'c-tab-heading c-tab-heading' + (props.activeTab === 'StateAndActions' ? '--active' : '')}>
            State & Actions
          </div>
          <div onClick={(event) => props.gitHub()} className={'c-tab-heading c-tab-heading' + (props.activeTab === 'Github' ? '--active' : '')}>
            Github API
          </div>
        </div>
        <br />
        <div className={'c-tabs__tab' + (props.activeTab === 'StateAndActions' ? '--active' : '')}>
          <HeaderButton />
          <br />
          <Input />
        </div>
        <div className={'c-tabs__tab' + (props.activeTab === 'Github' ? '--active' : '')}>
          <LoadDataInput />
          <br />
          <StarCountButton />
        </div>
      </div>
      <Toast />
    </div>
  )
}
)

```

And add following state to *./src/index.js*:
```js
...
activeTab: 'StateAndActions'
...
```
And as well the following Signals:
```js
...
stateAndActionsRouted: [
        set(state`activeTab`, 'StateAndActions')
      ],
      gitHubRouted: [
        set(state`activeTab`, 'Github')
      ]
...
```
Now you can testdrive your changes.
You should see the first tab activated.
Now go to debugger and change *activeTab* state to 'Github' and you will see the second tab.
Or just click the tab to achieve the same :)
Nice! But what has this to do with Routing?
Well thats Routing made easy. It is all about *Signals* and *State* and that is stuff we already know.

Now imagine your browsers addressbar is just an input. If that input changes it calls a signal that changes *activeTab* state.

Yeah! That is basically what **cerebral-router** does! 

Let us introduce **cerebral-router** to our project by adding an import to the top of our *./src/index.js*:

```js
import Router from 'cerebral-router'

```

And go ahead by doing the router config as follows inside the controller:
```js
...
    router: Router({
      routes: {
        '/': 'stateAndActionsRouted',
        '/github': 'gitHubRouted'
      },
      onlyHash: true // Use hash urls
    })
...
```

As you can see, defining *Routes* is as easy as linking them to *Signals*
Now go to your browsers adressbar and enter localhost/#/*github* and voilà the gitHubRouted-Signal gets called.
And also watch the browsers addressbar while you are switching tabs!
Thats it! 
