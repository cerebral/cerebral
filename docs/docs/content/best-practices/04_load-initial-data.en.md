---
title: Load initial data
---

## Load initial data

Typically you need to fetch some initial data when your application loads. Since the only place to do this is in signals, you need to trigger a signal when your application loads.

The most straight forward way to do this is when to trigger a signal when your application loads.

In your root component, typically **App**:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'

export default connect({
  title: state`app.title`
  mounted: signal`app.mounted`
},
  class App extends React.Component {
    componentDidMount() {
      this.props.mounted()
    }
    render() {
      return (
        <div>
          <h1>{this.props.title}</h1>
        </div>
      )
    }
  }
)
```

Now you do whatever data fetching and state updates you need in the **mounted** signal.

### With routing
When you use the router there might be multiple entry points to your application and at any point you need to load some initial data. This is where factories comes in handy. Imagine one of the modules:

```js
import openModule from './chains/openModule'
import withInitialData from '../../common/factories/withInitialData'

export default {
  state: {
    foo: 'bar'
  },
  signals: {
    routed: withInitialData(openModule)
  }
}
```

You would do the same with any other routing entry points. The **withInitialData** factory simply does something like this:

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

function withInitialData (continueChain) {
  return [
    set(state`app.isLoading`, true),
    [
      getThisData, {
        success: [],
        error: []
      }
      getThatData, {
        success: [],
        error: []
      }
    ],
    set(state`app.isLoading`, false),
    ...continueChain
  ]
}
```

We basically run a chain and compose in whatever we want to continue doing when it is done.
