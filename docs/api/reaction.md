# Reaction

The Reaction API allows you to respond to state changes outside the normal component rendering flow.

## API Reference

### Basic Syntax

```js
import { Reaction } from 'cerebral'
import { state } from 'cerebral'

const dispose = Reaction(
  // State dependencies
  {
    count: state`count`,
    user: state`user`
  },
  // Callback function
  ({ count, user, get }) => {
    // Called when any dependency changes
    console.log(`Count: ${count}, User: ${user.name}`)

    // You can access additional state using get
    const otherValue = get(state`otherPath`)
  }
)

// Call dispose to stop the reaction
dispose()
```

### Parameters

1. **dependencies** (Object): An object where keys define the property names in the callback's argument, and values are tags pointing to state paths.

2. **callback** (Function): A function called when tracked state changes. Receives an object containing:

   - All dependencies defined in the first argument
   - A `get` function to access additional state values

3. **options** (Object, optional): Configuration options
   - `immediate` (Boolean): If true, runs the callback immediately after creating the reaction
   - `nested` (Boolean): If true, reacts to nested property changes of objects/arrays

### Return Value

The Reaction function returns a disposal function. Call this function to stop the reaction from firing.

## Component Context Reaction

You will typically use reactions with your components, for example:

```js
import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

export default connect(
  {
    inputValue: state`inputValue`,
    changeInputValue: sequences`changeInputValue`
  },
  class MyComponent extends React.Component {
    componentDidMount() {
      this.props.reaction(
        'focusUsername', // Name for debugging
        {
          error: state`usernameError`
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

Component reactions are automatically disposed when the component unmounts.

## Function Component Example

```js
import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

export default connect(
  {
    inputValue: state`inputValue`,
    changeInputValue: sequences`changeInputValue`
  },
  function MyComponent({ inputValue, changeInputValue, reaction }) {
    const inputRef = React.useRef(null)

    React.useEffect(() => {
      // Create reaction that focuses input on error
      const dispose = reaction(
        'focusUsername',
        { error: state`usernameError` },
        ({ error }) => {
          if (error && inputRef.current) {
            inputRef.current.focus()
          }
        }
      )

      // Clean up on unmount
      return dispose
    }, [])

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

## Examples

### With Immediate Execution

```js
Reaction(
  { user: state`user` },
  ({ user }) => {
    console.log(`User: ${user.name}`)
  },
  { immediate: true }
)
```

### Tracking Nested Changes

```js
Reaction(
  { users: state`users` },
  ({ users }) => {
    console.log('Users updated:', users)
  },
  { nested: true }
)
```

For more advanced usage patterns, see the [reactions guide](/docs/advanced/reactions.html).
