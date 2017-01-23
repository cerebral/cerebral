# Compute state

**Load up chapter 08** - [Preview](08)

In our application we want to sum up the number of stars. One approach would be to create an action in our signal:

```js
function setStarsCount({state}) {
  state.set('starsCount',
    state.get('repos.cerebral.stargazers_count') +
    state.get('repos.addressbar.stargazers_count')
  )
}
```

This is a perfectly okay approach for our simple scenario, but computing state like this can be tedious in large applications. We might want to use this state multiple places in our application and we want to make sure it is the same wherever we use it.

## Computing
In Cerebral we can automatically compute state by using **compute**. It is basically a function that takes any number of arguments to produce a value. Let us look at how it works with our scenario:

```js
import {compute} from 'cerebral'

export default compute(function starsCount (get) {
  const repos = get.state('repos.**')

  return Object.keys(repos).reduce((currentCount, repoKey) => {
    return currentCount + repos[repoKey].stargazers_count
  }, 0)
})
```
We depend on our repos state and declear that we also care about any changes to them. Then we just count the stars and return it. The **get** would also allows you to grab props if it was used with a component or input if it was used in a signal. When the compute is used with a component it will automatically track whatever dependencies it has and only runs when any of those dependencies change.

Let us finish this example. To do so please create a new folder named *./src/computeds* and save a file named *starsCount.js* containing the snippet we just looked at. Then we would like to use our computed both in the signal and we also want to show the count in our component.

## Replacing with computed
Let us remove the **setStarsCount** action and just use the computed directly:

```js
...
import starsCount from './computeds/starsCount'
...
{
  buttonClicked: [
    [
      ...showToast('Loading data for repos...', 2000),
      getRepo('cerebral'), {
        success: [set(state`repos.cerebral`, input`result`)],
        error: []
      },
      getRepo('cerebral-debugger'), {
        success: [set(state`repos.cerebral-debugger`, input`result`)],
        error: []
      }
    ],
    ...showToast(string`The repos have ${starsCount} stars`, 5000)
  ]
}
...
```

You can use computeds directly in tags, with operators, in actions and in components:

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
If you wonder why the button updates its star count before the toast, it is because we have said the "Loading data for repos" should stick for 2 seconds.

Thats it for now regarding *Compute*. Of course summarizing some numbers is pretty simple stuff, but you can compute anything.

But now it has only been Cerebral stuff, what if you want to use other libraries in your action flow? Well, refill your coffee or open up another drink and enjoy the next chapter introducing **providers**.

**Want to dive deeper?** - [Go in depth](../in-depth/11_computed.html), or move on with the tutorial
