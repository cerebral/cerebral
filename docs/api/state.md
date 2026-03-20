# State

## Get state

State in Cerebral is accessed using the `get` provider with tags.

```js
import { state, moduleState } from 'cerebral'

function someAction({ get }) {
  // Get state using path tag
  const stateAtSomePath = get(state`some.path`)

  // Get state using object notation (proxy)
  const sameState = get(state.some.path)

  // Get state from current module
  const stateAtModulePath = get(moduleState`isLoading`)

  // Also works with object notation
  const sameModuleState = get(moduleState.isLoading)

  // Access computed values the same way
  const computedValue = get(state`someComputed`)
}
```

```marksy
<Info>
The object notation (proxy) syntax requires the [@cerebral/babel-plugin](/docs/api/proxy.html) to be configured in your project. The template literal tag syntax (`` state`path` ``) works without additional configuration.
</Info>
```

## Updating state

State updates must be performed in actions using the `store` provider:

```js
import { state, moduleState } from 'cerebral'

function someAction({ store }) {
  // Set a value
  store.set(state`some.path`, 'someValue')

  // Set using object notation
  store.set(state.some.path, 'someValue')

  // Set value in current module
  store.set(moduleState`isLoading`, true)
}
```

### Store API Methods

```js
function storeExample({ store }) {
  // Set or replace a value
  store.set(state`some.path`, 'someValue')

  // Set to undefined is the same as unset
  store.set(state`some.path`, undefined)

  // Toggle a boolean value
  store.toggle(state`isActive`)

  // Increment number (default increment is 1)
  store.increment(state`count`)
  store.increment(state`count`, 5)

  // Array operations
  store.push(state`items`, 'newItem') // Add to end of array
  store.unshift(state`items`, 'newItem') // Add to beginning of array
  store.pop(state`items`) // Remove last item
  store.shift(state`items`) // Remove first item
  store.splice(state`items`, 2, 1, 'newItem') // Remove/insert items
  store.concat(state`items`, ['a', 'b']) // Concatenate arrays

  // Object operations
  store.merge(state`user`, { name: 'John', age: 25 }) // Merge object properties
  store.unset(state`user.temporaryData`) // Remove property
}
```

```marksy
<Warning>
**Important:** Never mutate state values directly in your actions or components. Always use the store API to ensure changes are tracked by Cerebral's state system and debugger.
</Warning>
```

## Using moduleState

The `moduleState` tag allows you to operate on state relative to the current module:

```js
function someAction({ store, get }) {
  // If running in a module at "app.dashboard", this points to "app.dashboard.isLoading"
  store.set(moduleState`isLoading`, true)

  const isLoading = get(moduleState`isLoading`)
}
```

## Path resolution

You can use dynamic paths with template literals:

```js
function selectUser({ store, props }) {
  store.set(state`users.${props.userId}.isSelected`, true)
}
```

## Special values support

Cerebral supports these special value types that can be stored in state:

- **File**
- **FileList**
- **Blob**
- **ImageData**
- **RegExp**

These values are treated as immutable - they will never be cloned or modified directly.

```js
function uploadFile({ store, props }) {
  // Store a file object directly in state
  store.set(state`uploadedFiles.${props.id}`, props.file)
}
```

If you need to support additional special types, you can configure this in the devtools options.
