# Factories

Factories are functions that create actions for you. They help you manipulate state and control execution flow with a declarative API.

## State Manipulation Factories

Cerebral includes a set of factories for common state operations, all imported from 'cerebral/factories':

```js
import { set, push, toggle } from 'cerebral/factories'
```

### concat

Concatenate values to an array:

```js
concat(state`list`, ['foo', 'bar'])
```

### increment

Increment a number by a specific value (default is 1):

```js
// Basic increment by 1
increment(state`counter`)

// Increment by specific value
increment(state`counter`, 5)

// Decrement using negative values
increment(state`counter`, -1)

// Use values from state or props
increment(state`counter`, state`incrementBy`)
increment(state`counter`, props`amount`)
```

### merge

Merge objects into existing values:

```js
// Simple merge
merge(state`user`, { name: 'John', age: 30 })

// Merge with props
merge(state`user`, props`userData`)

// Merge with dynamic keys
merge(state`clients.$draft`, {
  name: props`name`,
  email: props`email`
})
```

### pop

Remove and return last element from an array:

```js
pop(state`items`)
```

### push

Add items to the end of an array:

```js
push(state`items`, 'new item')
push(state`items`, props`newItem`)
```

### set

Set a value in state or props:

```js
// Basic usage
set(state`user.name`, 'John')
set(props`redirect`, true)

// Transform value before setting
set(state`count`, props`count`, (value) => value * 2)
```

### shift

Remove and return the first element from an array:

```js
shift(state`items`)
```

### splice

Modify an array by removing or replacing elements:

```js
// Remove 2 elements starting at index 0
splice(state`items`, 0, 2)

// Remove 1 element at index 2 and insert new elements
splice(state`items`, 2, 1, 'new item', props`item2`)
```

### toggle

Toggle a boolean value:

```js
toggle(state`menu.isOpen`)
```

### unset

Remove a property from an object:

```js
unset(state`user.temporaryData`)
unset(state`items.${props`itemKey`}`)
```

### unshift

Add elements to the beginning of an array:

```js
unshift(state`items`, 'new first item')
```

## Flow Control Factories

These factories help control the execution flow of your sequences.

### debounce

Delay execution of a path until a specified time has passed without another call:

```js
import { debounce } from 'cerebral/factories'

// Basic usage
;[
  debounce(500), // Wait 500ms without new calls
  {
    continue: [actions.search], // Run when debounce completes
    discard: [] // Must be present - run when debounce is abandoned
  }
]

// Shared debounce across multiple sequences
const sharedDebounce = debounce.shared()

export const notifyUser = [
  set(state`notification`, props`message`),
  sharedDebounce(2000),
  {
    continue: [unset(state`notification`)],
    discard: []
  }
]
```

```marksy
<Warning>
The `discard` path must always be present when using debounce, even if you don't need to run any actions when debounce is abandoned.
</Warning>
```

### equals

Branch execution based on a value comparison:

```js
equals(state`user.role`),
  {
    admin: [actions.loadAdminPage],
    user: [actions.loadUserPage],
    otherwise: [actions.redirectToLogin]
  }
```

### wait

Pause execution for a specified time:

```js
// Simple waiting
;[wait(500), actions.afterWaiting]

// Within parallel execution
parallel([
  [
    wait(500),
    {
      continue: [actions.afterWaiting]
    }
  ],
  actions.runInParallel
])
```

### when

Conditionally choose a path based on a value or predicate:

```js
// With direct value
when(state`user.isLoggedIn`),
  {
    true: [actions.redirectToDashboard],
    false: [actions.showLoginForm]
  }

// With custom predicate
when(state`user.role`, (role) => role === 'admin'),
  {
    true: [actions.showAdminTools],
    false: []
  }

// With multiple arguments
when(
  state`inputValue`,
  state`minLength`,
  (value, minLength) => value.length >= minLength
),
  {
    true: [set(state`isValid`, true)],
    false: [set(state`isValid`, false)]
  }
```

## Sequence and Parallel

These factories help compose sequences and run actions in parallel:

```js
import { sequence, parallel } from 'cerebral/factories'

// Create a named sequence
export const mySequence = sequence('My Sequence', [
  actions.doSomething,
  set(state`foo`, 'bar')
])

// Run actions in parallel
export const loadData = [
  parallel('Load Data', [
    actions.loadUsers,
    actions.loadPosts,
    actions.loadSettings
  ]),
  set(state`isLoaded`, true)
]
```

For more detailed usage examples and advanced patterns, see the [factories guide](/docs/advanced/factories.html).
