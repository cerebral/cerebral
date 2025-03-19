# Reactions

Sometimes you need to react to changes of the state outside the normal render flow. Reactions allow you to define logic that runs in response to specific state changes.

## When to Use Reactions

Reactions are useful for:

- Running side effects when state changes
- Triggering sequences in response to state updates
- Managing focus, scroll position, or other DOM operations
- Syncing state changes with external systems

## Reactions in Modules

When you create a module, you can attach reactions to it:

```js
import * as reactions from './reactions'

export default {
  state: {},
  reactions
}
```

Define your reactions in a separate file, _reactions.js_:

```js
import { Reaction } from 'cerebral'
import { state, sequences } from 'cerebral'

export const pageChanged = Reaction(
  // State dependencies to watch
  {
    page: state`currentPage`
  },
  // Callback that runs when dependencies change
  ({ page, get }) => {
    // You can trigger sequences
    get(sequences`openPage`)({ page })

    // Or perform other side effects
    document.title = `My App - ${page}`
  }
)
```

This reaction will run whenever the current page changes, triggering the `openPage` sequence with the new page and updating the document title.

## Reactions in Components

You can create reactions inside components to respond to state changes that may not directly affect rendering:

```js
import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

export default connect(
  {
    inputValue: state`form.inputValue`,
    changeInputValue: sequences`changeInputValue`
  },
  class FormInput extends React.Component {
    inputRef = React.createRef()

    componentDidMount() {
      // Create a reaction to focus the input when an error appears
      this.errorReaction = this.props.reaction(
        'focusOnError', // Name for debugging
        {
          error: state`form.error`
        },
        ({ error }) => {
          if (error && this.inputRef.current) {
            this.inputRef.current.focus()
          }
        }
      )
    }

    componentWillUnmount() {
      // Reactions created by components are automatically cleaned up,
      // but you can manually dispose them if needed
      // this.errorReaction()
    }

    render() {
      return (
        <input
          ref={this.inputRef}
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

Using reactions with React function components:

```js
import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

export default connect(
  {
    inputValue: state`form.inputValue`,
    changeInputValue: sequences`changeInputValue`
  },
  function FormInput({ inputValue, changeInputValue, reaction }) {
    const inputRef = React.useRef(null)

    React.useEffect(() => {
      // Setup reaction
      const dispose = reaction(
        'focusOnError',
        { error: state`form.error` },
        ({ error }) => {
          if (error && inputRef.current) {
            inputRef.current.focus()
          }
        }
      )

      // Clean up reaction on unmount
      return dispose
    }, []) // Empty dependency array = only run on mount

    return (
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(event) => changeInputValue({ value: event.target.value })}
      />
    )
  }
)
```

## Advanced Usage

### Accessing Additional State

Reactions provide a `get` function to access state not declared in dependencies:

```js
Reaction({ isLoggedIn: state`user.isLoggedIn` }, ({ isLoggedIn, get }) => {
  if (isLoggedIn) {
    // Access additional state on demand
    const username = get(state`user.name`)
    const permissions = get(state`user.permissions`)

    // Do something with this additional information
  }
})
```

### Options

You can pass options as a third argument:

```js
Reaction(
  { users: state`users` },
  ({ users }) => {
    console.log('Users updated:', users)
  },
  {
    // Run immediately after creating
    immediate: true,

    // Track nested changes to objects/arrays
    nested: true
  }
)
```

### With Computed Values

Reactions can depend on computed values:

```js
import { Reaction } from 'cerebral'
import { state } from 'cerebral'

// Define a computed value
export const filteredItems = (get) => {
  const items = get(state`items`)
  const filter = get(state`filter`)

  return items.filter((item) => item.type === filter)
}

// Create state with the computed
const appState = {
  items: [],
  filter: 'all',
  filteredItems
}

// Create a reaction that responds to the computed value
export const onFilteredItemsChange = Reaction(
  { filteredItems: state`filteredItems` },
  ({ filteredItems }) => {
    console.log('Filtered items changed:', filteredItems.length)
  }
)
```

The reaction will run whenever the computed value changes, which could happen when either `items` or `filter` changes.

### Clean Up

Reactions return a dispose function that you should call to clean them up when no longer needed:

```js
// Create the reaction
const dispose = Reaction({ data: state`some.data` }, ({ data }) => {
  // Do something with data
})

// Later, clean it up
dispose()
```

Component reactions are automatically disposed when the component unmounts.
