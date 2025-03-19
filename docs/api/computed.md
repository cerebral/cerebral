# Computed

Computed values allow you to derive state from your application state. They calculate and cache derived values based on dependencies from the state tree.

## API Reference

### Creating Computed

```js
import { state } from 'cerebral'

// Basic computed function
export const fullName = (get) => {
  const firstName = get(state`user.firstName`)
  const lastName = get(state`user.lastName`)

  return `${firstName} ${lastName}`
}

// With conditional logic
export const userStatus = (get) => {
  const isLoggedIn = get(state`user.isLoggedIn`)

  if (isLoggedIn) {
    const lastActive = get(state`user.lastActive`)
    return lastActive > Date.now() - 3600000 ? 'active' : 'away'
  }

  return 'offline'
}
```

The computed function receives a `get` parameter which is used to retrieve values from the state tree. Using `get` automatically creates dependency tracking.

### Using in State Tree

Computed values are added directly to your state tree:

```js
import { fullName, userStatus } from './computed'

export default {
  state: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      isLoggedIn: true,
      lastActive: Date.now()
    },
    fullName, // <-- Computed added to state
    userStatus // <-- Another computed
  }
}
```

### Accessing Computed Values

You can access computed values just like regular state:

```js
// In an action
function myAction({ get }) {
  const name = get(state`fullName`)
  // Do something with name
}

// In a component (React example)
connect(
  {
    name: state`fullName`,
    status: state`userStatus`
  },
  function User({ name, status }) {
    return (
      <div>
        <h1>{name}</h1>
        <span>Status: {status}</span>
      </div>
    )
  }
)
```

### Using Props

Computed values can access props when used in components:

```js
import { state, props } from 'cerebral'

export const itemDetails = (get) => {
  const itemId = get(props`itemId`)
  const item = get(state`items.${itemId}`)

  return item || { name: 'Unknown item' }
}
```

When used in a component:

```js
// React component
connect(
  {
    item: state`itemDetails`
  },
  function ItemDetails({ item }) {
    return <div>{item.name}</div>
  }
)

// Usage
<ItemDetails itemId="123" />
```

When used in an action, props must be passed explicitly:

```js
function myAction({ get }) {
  const item = get(state`itemDetails`, { itemId: '123' })
}
```

### The `get` Function

The `get` function has these capabilities:

1. **Retrieve state values**:

   ```js
   const user = get(state`user`)
   ```

2. **Access paths**:

   ```js
   const path = get.path(state`user.settings`)
   // Returns 'user.settings'
   ```

3. **Access other computed values**:

   ```js
   const name = get(state`fullName`)
   ```

## Behavior

```marksy
<Info>
- **Caching**: Computed values are cached and only recalculate when their dependencies change
- **Composition**: Computed values can use other computed values
- **Cloning**: When a computed uses props and is connected to a component, it's cloned for that instance
- **Optimization**: The dependency tracking ensures minimal recalculations
</Info>
```

For more examples and advanced usage patterns, see the [advanced computed documentation](/docs/advanced/computed.html).
