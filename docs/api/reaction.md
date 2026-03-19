# Reaction

The `Reaction` function creates a declarative way to react to state changes outside the normal component rendering flow.

## API Reference

### Signature

```js
Reaction(dependencies, callback)
```

### Parameters

- **dependencies** (Object): An object where keys define the property names in the callback's argument, and values are tags pointing to state paths. Optional - if omitted, the first argument is treated as the callback.

- **callback** (Function): A function called when tracked state changes. Receives an object containing:
  - All dependencies defined in the first argument
  - A `get` function to access additional state values

### Returns

A reaction object with the following methods:

- **create(controller, modulePath, name)**: Binds the reaction to a controller/app and associates it with a module.
  - `controller`: The Cerebral app/controller
  - `modulePath`: Array specifying the module path (e.g., `['users']`)
  - `name`: String identifier for debugging
  - Returns: The reaction instance

- **initialize()**: Registers the reaction with the dependency system.
  - Returns: The reaction instance
- **onUpdate()**: Manually triggers the reaction callback.

- **destroy()**: Cleans up the reaction by unregistering it from the dependency system.

### Examples

Basic usage:

```js
import { Reaction, state } from 'cerebral'

const logUser = Reaction(
  {
    user: state`user`,
    count: state`count`
  },
  ({ user, count, get }) => {
    console.log(`User: ${user.name}, Count: ${count}`)

    // Access additional state using get
    const otherValue = get(state`otherPath`)
  }
)
```

## Component API

When using components with Cerebral, a `reaction` prop is provided to create and manage reactions:

```js
// Class components
this.props.reaction(
  'debugName', // Optional name for debugging
  { error: state`usernameError` }, // Dependencies
  ({ error }) => {
    /* callback */
  } // Callback
)

// Function components
reaction('debugName', { error: state`usernameError` }, ({ error }) => {
  /* callback */
})
```

Component reactions are automatically disposed when the component unmounts.

For usage patterns and examples, see the [reactions guide](/docs/advanced/reactions.html).
