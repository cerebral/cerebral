# Compute
Normally you use state directly from the state tree, but sometimes you need to compute values. Typically filtering lists, grabbing the projects of a user, or other derived state.

Cerebral allows you to compute state that can be used in multiple contexts. Let us look at the signature:

```js
import {compute} from 'cerebral'

export default compute(() => {
  return 'foo'
})
```

You can now use this with **connect**:

```js
import computedFoo from '../computedFoo'

connect({
  foo: computedFoo
})
```

You can use it with operators in a signal:

```js
import computedFoo from '../computedFoo'
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo`, computedFoo)
]
```

Or you can resolve it inside an action if you need to:

```js
import computedFoo from '../computedFoo'

function myAction ({resolve}) {
  const foo = resolve.value(computedFoo)
}
```

You can even compose it into a Tag:

```js
import computedFoo from '../computedFoo'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default [
  set(state`${computedFoo}.bar`, 'baz')
]
```

## Getting data
Compute can manually grab data related to where it is run. For example in **connect** you have access to both state and properties of the component. In a signal you would have access to state and the props to the signal. You access these manually by combining the **get** argument with a related tag:

```js
import {compute} from 'cerebral'
import {state, props} from 'cerebral/tags'

export default compute((get) => {
  return get(state`foo`) + get(props`bar`)
})
```

Cerebral now knows what paths this computed is interested in and can optimize its need to run again to produce a changed value.

## Composing
What makes compute very powerful is its ability to compose tags and other compute. Any tags you pass as arguments will be passed in as a value to the next function in line. The last argument of the function is always the **get** function.

```js
import {compute} from 'cerebral'
import {state, props} from 'cerebral/tags'

const computedItemUsers = compute(
  state`items.${props`itemKey`}`,
  (item, get) => {
    return item.userIds.map((userId) => get(state`users.${userId}`))
  }
)

// In connect
connect({
  users: computedItemUsers
})
```

It uses the *itemKey* property from the component to grab the actual item. It then grabs each user based on the userIds of the item. You can also compose multiple compute together.

```js
connect({
  item: compute(filteredList, onlyAwesome)
})
```

Here *filteredList* returns a list of filtered items, where *onlyAwesome* expects to receive a list and filters it again.

```js
compute((list) => {
  return list.filter((item) => item.isAwesome)
})
```

It is possible to combine tags and functions as many times as you would like:

```js
compute(
  state`currentItemKey`,
  (currentItemKey, get) => {
    return get(state`item.${currentItemKey}`)
  },
  state`isAwesome`,
  (item, isAwesome) => {
    return item.isAwesome === isAwesome
  }
)
```

Typically you can get away with most things using Tags, but compute will help you with any other scenarios where more "umph" is needed.

## Factory
Typically you will create computed factories. Just think of compute as a function that is able to resolve tags and other computed. for example:

```js
import {compute} from 'cerebral'
import {state, props} from 'cerebral/tags'

export default (type) => {
  return compute(
    state`items`,
    (items) => {
      return items.filter(item => item.type === type)
    }
  )
}
```

This could now be used as:

```js
connect({
  filteredItems: filterCompute('typeA')
})
```

But we could be smarter about this. By changing it out like:

```js
import {compute} from 'cerebral'
import {state, props} from 'cerebral/tags'

export default (typeValue) => {
  return compute(
    typeValue,
    state`items`,
    (type, items) => {
      return items.filter(item => item.type === type)
    }
  )
}
```

Now we evaluate the value passed in, meaning it could also be a tag:

```js
connect({
  filteredItems: filterCompute(props`type`)
})
```

## Tutorial

**Before you start,** [load this BIN on Webpackbin](https://www.webpackbin.com/bins/-KdBaa45GzVJFOxU69Gp)

In our application we want to sum up the number of stars. We have already implemented a naive approach, which we are going to refactor. We created an action which adds the count together:

```js
function setStarsCount ({state}) {
  state.set('starsCount',
    state.get('repos.cerebral.stargazers_count') +
    state.get('repos.addressbar.stargazers_count')
  )
}
```

This is a perfectly okay approach for our simple scenario, but computing state like this can be tedious in large applications. We might want to use this state multiple places in our application, and we want to make sure it is the same wherever we use it.

### Computing
In Cerebral, we can automatically compute state by using **compute**. It is basically a function that takes any number of arguments to produce a value. Let us look at how it works with our scenario. Please add another file called *starsCount.js* to the bin and copy the following snippet into it:

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`repos`,
  (repos) => {
    return Object.keys(repos).reduce((currentCount, repoKey) => {
      return currentCount + repos[repoKey].stargazers_count
    }, 0)
  }
)
```

We depend on our repos state. Then we just count the stars and return it. When the compute is used with a component it will automatically track whatever dependencies it has and only runs when any of those dependencies change.

Now we would like to use our computed in the signal, and we want to show the count in our component.

### Replacing with computed
Let us remove the **setStarsCount** action and refactor our signal to instead grab the repos first, then we update the state in one go. This just to show you different strategies.

Check out the refactoring of our *getRepo* action. The factory is no longer return paths, just values. So either they return a result using the repo name as the key, or they will set an error.

```js
...
function getRepo (repoName) {
  function get ({http}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then((response) => {
        return {[repoName]: response.result}
      })
      .catch((response) => {
        return {error: response.error}
      })
  }

  return get
}
...
```

We can change now the signal to look like:

```js
...
import starsCount from './starsCount'
...
{
  buttonClicked: [
    showToast(string`Loading data for repos...`),
    parallel([
      getRepo('cerebral'),
      getRepo('addressbar')
    ]),
    when(props`error`), {
      'true': showToast(string`Error: ${props`error`}`, 5000),
      'false': [
        set(state`repos.cerebral`, props`cerebral`),
        set(state`repos.addressbar`, props`addressbar`),
        showToast(string`The repos have ${starsCount} stars`, 5000, 'success')
      ]
    }
  ]
}
...
```

We also use the *when* operator to figure out if we indeed have an error, diverging execution to show an error message. Otherwise, we update our state tree and show the message.

Note here that we also updated the *toast* to allow no time to be passed in, causing it to stick.

You can use computeds with other computeds, directly in tags, with operators, in actions and in components. Lets update our **App** component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import starsCount from './starsCount'
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

If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
