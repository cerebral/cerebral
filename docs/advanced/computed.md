# Computed

Computed values let you derive state from your application state tree. Instead of putting calculation logic in components or actions, computed values give you a dedicated place for this logic with automatic optimization.

## When to Use Computed Values

Use computed values when you need to:

- Filter or transform lists
- Combine multiple state values
- Calculate derived properties
- Cache expensive calculations
- Share derived state across components

## Basic Computed

Let's look at a simple example that filters a list based on criteria in state:

```js
import { state } from 'cerebral'

export const filteredList = (get) => {
  const items = get(state`items`)
  const filter = get(state`filter`)

  return items.filter((item) => item[filter.property] === filter.value)
}
```

Add it to your state tree:

```js
import { filteredList } from './computed'

export default {
  state: {
    items: [
      { id: 1, title: 'Item 1', isCompleted: false },
      { id: 2, title: 'Item 2', isCompleted: true }
    ],
    filter: {
      property: 'isCompleted',
      value: false
    },
    filteredList
  }
}
```

## Performance Benefits

When you use a computed value:

1. **Automatic dependency tracking**: The `get` function tracks every state path you access
2. **Smart caching**: The computed value only recalculates when its dependencies change
3. **Composition optimization**: When computed values use other computed values, the dependency tree is maintained

This makes computed values significantly more efficient than calculating derived state in components or actions.

## Composition

You can compose computed values by using other computed values:

```js
import { state } from 'cerebral'

// First computed
export const activeUsers = (get) => {
  const users = get(state`users`)
  return users.filter((user) => user.isActive)
}

// Second computed using the first
export const activeAdmins = (get) => {
  const active = get(state`activeUsers`)
  return active.filter((user) => user.isAdmin)
}
```

In your state tree:

```js
import { activeUsers, activeAdmins } from './computed'

export default {
  state: {
    users: [
      /* user objects */
    ],
    activeUsers,
    activeAdmins
  }
}
```

## Dynamic Computed with Props

Computed values can access component props, making them dynamic:

```js
import { state, props } from 'cerebral'

export const userItems = (get) => {
  const userId = get(props`userId`)
  const items = get(state`items`)

  return items.filter((item) => item.userId === userId)
}
```

Use it in a component:

```js
// React example
connect(
  {
    items: state`userItems`
  },
  function UserItems({ items }) {
    return (
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    )
  }
)

// When using the component
<UserItems userId="user-123" />
```

Behind the scenes, Cerebral clones the computed for each component instance to maintain individual caching.

## Creating Computed Factories

Sometimes you'll want to create reusable computed patterns. You can create a computed factory:

```js
import { state } from 'cerebral'

export const itemsByStatus = (statusKey) => (get) => {
  const items = get(state`items`)
  const status = get(state`${statusKey}`)

  return items.filter((item) => item.status === status)
}

// Usage in state
export default {
  state: {
    items: [],
    activeStatus: 'pending',
    archivedStatus: 'archived',

    // Created from factory
    pendingItems: itemsByStatus('activeStatus'),
    archivedItems: itemsByStatus('archivedStatus')
  }
}
```

## Using in Actions

You can use computed values in actions just like any other state:

```js
function myAction({ get, store }) {
  const filteredItems = get(state`filteredList`)

  if (filteredItems.length === 0) {
    store.set(state`noResults`, true)
  }
}
```

For computed values that require props, pass them as the second argument:

```js
function myAction({ get }) {
  const userItems = get(state`userItems`, { userId: 'user-123' })
  // Do something with userItems
}
```

## Best Practices

1. **Keep computed values pure**: Don't cause side effects in computed functions
2. **Move complex logic out of components**: Extract calculations into computed values
3. **Be specific with dependencies**: Only access the state you need
4. **Compose for clarity**: Break complex computations into smaller, composable pieces
5. **Watch for expensive operations**: Even computed values will run when dependencies change

By following these patterns, computed values can significantly improve your application's performance and maintainability.
