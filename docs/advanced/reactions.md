# Reactions

Reactions allow you to respond to state changes outside the normal rendering flow. This guide covers common usage patterns for reactions in different scenarios.

## When to Use Reactions

Reactions are useful for:

- Running side effects when state changes
- Triggering sequences in response to state updates
- Managing focus, scroll position, or other DOM operations
- Syncing state changes with external systems

## Reactions in Modules

When creating a module, you can attach reactions that respond to state changes:

```js
// modules/admin.js
import { Reaction } from 'cerebral'
import { state, sequences } from 'cerebral'

// Define reactions in a separate file
export const watchPermissions = Reaction(
  { permissions: state`user.permissions` },
  ({ permissions, get }) => {
    if (!permissions.includes('admin')) {
      get(sequences`redirectToHome`)()
    }
  }
)
```

This pattern allows you to define side effects that run automatically when specific state changes.

## Reactions in Components

Components often need to react to state changes for side effects like focus management:

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

    // The reaction prop is provided by the connect HOC
    reaction(
      'focusOnError', // Name for debugging
      { error: state`form.error` },
      ({ error }) => {
        if (error && inputRef.current) {
          inputRef.current.focus()
        }
      }
    )

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

## Advanced Usage Patterns

### Computed-Based Reactions

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

// Create app state with the computed
const appState = {
  items: [],
  filter: 'all',
  filteredItems
}

// Create a reaction to the computed
export const onFilteredItemsChange = Reaction(
  { filteredItems: state`filteredItems` },
  ({ filteredItems }) => {
    console.log('Filtered items changed:', filteredItems.length)
  }
)
```

### Accessing Additional State

Reactions provide a `get` function to access state not declared in dependencies:

```js
Reaction({ isLoggedIn: state`user.isLoggedIn` }, ({ isLoggedIn, get }) => {
  if (isLoggedIn) {
    // Only access these values when needed
    const username = get(state`user.name`)
    const permissions = get(state`user.permissions`)

    // Use the dynamically accessed values
    analytics.identify(username, { permissions })
  }
})
```

### Reacting to Multiple State Changes

A single reaction can depend on multiple state paths:

```js
Reaction(
  {
    filter: state`items.filter`,
    sort: state`items.sort`,
    items: state`items.list`
  },
  ({ filter, sort, items }) => {
    // This runs when filter, sort, or items change
    const processed = processItems(items, filter, sort)
    localStorage.setItem('processedItems', JSON.stringify(processed))
  }
)
```
