---
title: Popups
---

## Popups

Popups are different than modals. They are more in the realm of dropdowns, popup menus and even tooltips. What they share in behavior is that if you open one of them, the others should close. There are two approaches to this. You can create a stateful component handler for it, or you can use Cerebral and make it very explicit. There is no right answer, it depends on your application. But let us look at the Cerebral approach.

### Closing everything
First we need to close all these popup when we click our application. Let us create a chain that closes them:

```js
import {state, set} from 'cerebral/operators';

export default [
  // A specific popover
  set(state`app.showSomePopover`, false),
  // A popover based on a userKey (dynamic)
  set(state`app.currentUserKeyPopover`, null)
]
```

Now we register this chain to a signal on our **app** module:

```js
import closePopovers from './chains/closePopovers'

export default {
  state: {
    showSomePopover: false,
    currentUserKeyPopover: null
  },
  signals: {
    clicked: closePopovers
  }
}
```

And then in our root component we trigger the signal whenever we click our application:

```js
import {connect} from 'cerebral/react'

export default connect({}, {
  clicked: 'app.clicked'
},
  function App (props) {
    return (
      <div onClick={() => props.clicked()}>
        ...
      </div>
    )
  }
)
```

Whenever we now click our application all our popups will close and we can see that behavior in the debugger as well.

### Prevent closing
So when we now click a button to show a popover we have to ensure that our application does not trigger the click event on the root component, because then they will just close again. Let us imagine we have a signal that changes the *showSomePopover* state to *true* (showSomePopoverClicked).

```js
import {connect} from 'cerebral/react'

export default connect({
  showSomePopover: 'app.showSomePopover'
}, {
  showSomePopoverClicked: 'app.showSomePopoverClicked'
},
  function MyPopover(props) {
    return (
      <div onClick={(event) => {
        event.stopPropagation()
        props.showSomePopoverClicked()
      }}>
        <div>
          Show popover
        </div>
        {
          props.showSomePopoverClicked ?
            <div>Some popover</div>
          :
            null
        }
      </div>
    )
  }
)
```

Using **event.stopPropagation()** we prevent any clicks on the button and the popover itself to propagate up to the application root component. So when our chain handling the popover click runs:

```js
import {state, set} from 'cerebral/operators';

export default [
  set(state`app.showSomePopover`, true)
]
```

We will show the popover. Clicking outside it will hide it. Now, you might want to close all the other popovers when you open a new one. Just compose it in:

```js
import closePopovers from '../chains/closePopovers'
import {state, set} from 'cerebral/operators';

export default [
  ...closePopovers,
  set(state`app.somePopover`, true)
]
```

So this gives you complete control of handling popups and you can make any kind of custom behavior to any of them.

### Dynamic popups
Sometimes you have a list where each item in the list should show a popup. In this case we want to dynamically open a popup. It is basically the same approach, but we use a state property that takes a reference to the current item instead:

```js
import openItemPopover from './chains/openItemPopover'

export default {
  state: {
    currentItemPopover: null,
    items: {
      '123': {
        title: 'Some item'
      },
      '456': {
        title: 'Some other item'
      }
    }
  },
  signals: {
    itemPopoverClicked: openItemPopover
  }
}
```

So now let us imagine that we are dynamically building a list of items which contains a popover. For each item we create a new component:

```js
import {connect} from 'cerebral/react'

export default connect((props) => ({
  item: `app.items.${props.itemKey}`
  currentItemPopover: 'app.currentItemPopover'
}), {
  itemPopoverClicked: 'app.itemPopoverClicked'
},
  function Item(props) {
    return (
      <div>
        <div>{props.item.title}</div>
        <div onClick={(event) => {
          event.stopPropagation()
          props.itemPopoverClicked({
            itemKey: props.itemKey
          })
        }}>
          <div>
            Show popover
          </div>
          {
            props.currentItemPopover === props.itemKey ?
              <div>Some popover</div>
            :
              null
          }
        </div>
      </div>
    )
  }
)
```

What we do here is rather check if the current item popover matches the key of the item itself. So our **openItemPopover** chain would look something like:

```js
import {state, input, set} from 'cerebral/operators'

export default [
  set(state`app.currentItemPopover`, input`itemKey`)
]
```

Now you can again change this behavior. You might use an array instead to allow opening multiple popovers. But this is pretty much how you go about.

### What if Cerebral is inside other app?
If your root component does not cover the whole browser you can rather listen to clicks on the window, using react as example:

```js
import {connect} from 'cerebral/react'

export default connect({
  someState: 'app.someState'
}, {
  clicked: 'app.clicked'
},
  class App extends React.Component {
    componentDidMount() {
      window.addEventListener('click', () => this.props.clicked())
    }
    render() {
      return (
        <div>
          ...
        </div>
      )
    }
  }
)
```

But now we are outside of React own event system. So when you click something you have to make sure that you stop propagating the native event, not React event.

```js
import {connect} from 'cerebral/react'

export default connect({
  showPopover: 'app.showPopover'
}, {
  showPopoverClicked: 'app.showPopoverClicked'
},
  function MyPopover(props) {
    return (
      <div onClick={(event) => {
        event.nativeEvent.stopPropagation()
        props.showPopoverClicked()
      }}>
        <div>
          Show popover
        </div>
        {
          props.showPopover ?
            <div>Some popover</div>
          :
            null
        }
      </div>
    )
  }
)
```
