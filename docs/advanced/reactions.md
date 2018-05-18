# Reactions

Sometimes you need to react to changes of the state. You might want to run a sequence related to a change of the state or maybe some logic inside a component. Reactions allows you to express this kind of logic.

## Reactions in modules

When you create a module you can attach a reaction to it:

```js
import { Module } from 'cerebral'
import * as reactions from './reactions'

export default Module({
  reactions
})
```

So you would typically create your reactions in a separate file, *reactions.js*:

```js
import { Reaction } from 'cerebral'
import { state, sequences } from 'cerebral/proxy'

export const pageChanged = Reaction(
  {
    page: state.currentPage
  },
  ({ page, get }) => {
    get(sequences.openPage)({ page })
  }
)
```

This reaction will react to whenever the current page is changed and fire off the **openPage** signal, with the new page.

## Reactions in views

You can also create reactions inside views, here shown with *React*:

```js
import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral/proxy'

export default connect(
  {
    inputValue: state.inputValue,
    changeInputValue: sequences.changeInputValue
  },
  class MyComponent extends React.Component {
    componentDidMount() {
      this.props.reaction(
        'focusUsername',
        {
          error: state.usernameError
        },
        ({ error }) => error && this.input.focus()
      )
    }
    render() {
      return (
        <input
          ref={(node) => {
            this.input = node
          }}
          value={this.props.inputValue}
          onChange={(event) =>
            this.props.changeInputValue({ value: event.target.value })
          }
        />
      )
    }
  }
)
```

These reactions are destroyed when the view is unmounted.

```marksy
<Info>
Also the view reaction receives the **get** property allowing you to grab arbitrary state etc.

A reaction can also depend on a computed, allowing you to react to computed updates.
</Info>
```
