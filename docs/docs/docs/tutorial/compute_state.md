# Compute state

**Load up chapter 08** - [Preview](08)

In our application we want to sum up the number of stars. We have already implemented a naive approach, which we are going to refactor. We created an action which adds the count together:

```js
function setStarsCount ({state}) {
  state.set('starsCount',
    state.get('repos.cerebral.stargazers_count') +
    state.get('repos.addressbar.stargazers_count')
  )
}
```

This is a perfectly okay approach for our simple scenario, but computing state like this can be tedious in large applications. We might want to use this state multiple places in our application and we want to make sure it is the same wherever we use it.

## Computing
In Cerebral, we can automatically compute state by using **compute**. It is basically a function that takes any number of arguments to produce a value. Let us look at how it works with our scenario:

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`repos`,
  function starsCount (repos) {
    return Object.keys(repos).reduce((currentCount, repoKey) => {
      return currentCount + repos[repoKey].stargazers_count
    }, 0)
  }
)
```

We depend on our repos state. Then we just count the stars and return it. When the compute is used with a component it will automatically track whatever dependencies it has and only runs when any of those dependencies change. You can use computed for even more granular control of the state and even component props dependencies, but you can read more about that later.

Let us finish this example. To do so please create a new folder named *./src/computeds* and save a file named *starsCount.js* containing the snippet we just looked at. Then we would like to use our computed both in the signal and we also want to show the count in our component.

## Replacing with computed
Let us remove the **setStarsCount** action and refactor our signal to rather grab the repos first and then we update the state in one go. This just to show you different strategies.

The first thing to notice is that our *getRepo* action factories no longer return paths, they just return values. So either they return a result using the repo name as the key, or they will set an error.

We also use the *when* operator to figure out if we indeed have an error, diverging execution to show an error message. If that is not the case, we update our state tree on show the message.

Note here that we also updated the *toast* to allow no time to passed in, causing it to stick.

```js
...
import starsCount from './computeds/starsCount'
...
{
  buttonClicked: [
    ...showToast(string`Loading data for repo: ${input`repo`}`),
    [
      getRepo('cerebral'),
      getRepo('addressbar')
    ],
    when(input`error`), {
      true: [
        ...showToast(string`Error: ${input`error`}`, 5000)
      ],
      false: [
        set(state`repos.cerebral`, input`cerebral`),
        set(state`repos.addressbar`, input`addressbar`),
        ...showToast(string`The repos have ${starsCount} stars`, 5000)
      ]
    }
  ]
}
...
```

You can use computeds with other computeds, directly in tags, with operators, in actions and in components. Lets update our **App** component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import starsCount from '../../computeds/starsCount'
import Toast from '../Toast'

export default connect({
  title: state`title`,
  subTitle: state`subTitle`,
  buttonClicked: signal`buttonClicked`,
  starsCount
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <button
          className="c-button c-button--info c-button--block"
          onClick={() => props.buttonClicked()}
        >
          Update star count ({props.starsCount})
        </button>
        <Toast />
      </div>
    )
  }
)
```
Thats it for now regarding *Compute*. Of course summarizing some numbers is pretty simple stuff, but you can compute anything.

But now it has only been Cerebral stuff, what if you want to use other libraries in your action flow? Well, refill your coffee or open up another drink and enjoy the next chapter introducing **providers**.

**Want to dive deeper?** - [Go in depth](../in_depth/compute.md), or move on with the tutorial
