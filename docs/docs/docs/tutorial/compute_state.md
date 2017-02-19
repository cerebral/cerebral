# Compute state

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/#/bins/-KdBaa45GzVJFOxU69Gp)

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

Let us finish this example. To do so please create a new file named *starsCount.js* containing the snippet we just looked at. Then we would like to use our computed both in the signal and we also want to show the count in our component.

## Replacing with computed
Let us remove the **setStarsCount** action and refactor our signal to rather grab the repos first and then we update the state in one go. This just to show you different strategies.

The first thing we need to do is refactor our *getRepo* action factories to no longer return paths, just values. So either they return a result using the repo name as the key, or they will set an error.

```js
...
function getRepo (repoName) {
  function get ({http}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then((response) => {
        return {[repoName]: response.result}
      })
      .catch((error) => {
        return {error: error.result}
      })
  }

  return get
}
...
```

Then we change how our signal looks:

```js
...
import starsCount from './computeds/starsCount'
...
{
  buttonClicked: [
    ...showToast(string`Loading data for repos...`),
    [
      getRepo('cerebral'),
      getRepo('addressbar')
    ],
    when(props`error`), {
      'true': [
        ...showToast(string`Error: ${props`error`}`, 5000)
      ],
      'false': [
        set(state`repos.cerebral`, props`cerebral`),
        set(state`repos.addressbar`, props`addressbar`),
        ...showToast(string`The repos have ${starsCount} stars`, 5000)
      ]
    }
  ]
}
...
```

We also use the *when* operator to figure out if we indeed have an error, diverging execution to show an error message. If that is not the case, we update our state tree on show the message.

Note here that we also updated the *toast* to allow no time to passed in, causing it to stick.



You can use computeds with other computeds, directly in tags, with operators, in actions and in components. Lets update our **App** component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import starsCount from '.starsCount'
import Toast from './Toast'

export default connect({
  title: state`title`,
  subTitle: state`subTitle`,
  buttonClicked: signal`buttonClicked`,
  starsCount
},
  function App ({title, subTitle, buttonClicked, starsCount}) {
    return (
      <div>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
        <button onClick={() => buttonClicked()}>
          Update star count ({starsCount})
        </button>
        <Toast />
      </div>
    )
  }
)
```
Thats it for now regarding *Compute*. Of course summarizing some numbers is pretty simple stuff, but you can compute anything.

But now it has only been Cerebral stuff, what if you want to use other libraries in your action flow? Well, refill your coffee or open up another drink and enjoy the next chapter introducing **the router**.

If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
