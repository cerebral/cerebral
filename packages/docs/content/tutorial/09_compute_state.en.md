---
title: ch08. Compute state
---

## Compute state

**Load up chapter 08** - [Preview](08)

In the previous challenge the solution was to use an action to sum the star counts together. It looks like this:

```js
function setStarsSum({state}) {
  state.set('starsSum',
    state.get('repos.cerebral.stargazers_count') +
    state.get('repos.addressbar.stargazers_count')
  )
}
```

This is a perfectly okay approach for our simple scenario, but computing state like this can be tedious in large applications. We might want to use this state multiple places in our application and we want to make sure it is the same wherever we use it.

In Cerebral we can automatically compute state using a **Computed**.

```js
import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  repos: state`repos`
}, ({repos}) => {
  return Object.keys(repos).reduce((currentCount, repoKey) => {
    return currentCount + repos[repoKey].stargazers_count
  }, 0)
})
```
This looks pretty similar to the component pattern. And it is actually doing pretty much the same thing under the hood.

Now whenever this *Computed* is accessed it is either using a cached value to return the result, or it will recalculate itself if the state path (*repos*) has changed since last time. Pretty cool!

Let us finish this example. To do so please create a new folder named *./src/computeds* and save a file named *starsSum.js* containing the snippet we just looked at. Then we would like to use our computed both in the signal and we also want to show the count in our component.

Let us remove the **setStarsSum** action and just use the computed directly:

```js
...
import starsSum from './computeds/starsSum'
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
    ...showToast(string`The repos have ${starsSum} stars`, 5000)
  ]
}
...
```

You can use computeds directly in operator tags, in actions and in components:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import starsSum from '../../computeds/starsSum'
import Toast from '../Toast'

export default connect({
  title: state`title`,
  subTitle: state`subTitle`,
  buttonClicked: signal`buttonClicked`,
  starsCount: starsSum
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

Thats it for now regarding *Computeds*. Of course summarizing some numbers is pretty simple stuff, but you can compute state into any result. Very powerful!

But now it has only been Cerebral stuff, what if you want to use other libraries in your action flow? Well, refill your coffee or open up another drink and enjoy the next chapter introducing **providers**.

**Want to dive deeper?** - [Go in depth](../in-depth/11_computed.html), or move on with the tutorial
