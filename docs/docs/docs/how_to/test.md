# Test

Cerebral makes it easy to test your application components and business logic.

## Components
The **Container** you use to expose Cerebral to your components can also be used when testing, but you can also use the **StateContainer** which allows you to pass state down to your components as if it was extracted from the Cerebral controller.

```js
import React from 'react'
import {mount} from 'enzyme'
import {StateContainer} from 'cerebral/react'

import Foo from './Foo'

describe('<Foo />', () => {
  it('allows us to set props', () => {
    const state = {
      foo: 'bar'
    }
    const wrapper = mount(
      <StateContainer state={state}>
        <Foo />
      </StateContainer>
    )
    expect(wrapper.find('.foo')).to.have.length(1)
  })
})
```

This approach allows you to pass down state wherever you want and ensure the components render as expected.

## Computes

The `runCompute` test helper accepts a `compute` and `fixtures` arguments and returns the compute output.

```js
var result = runCompute(compute, state)
```

The optional `fixture` argument should be an object that contains any of the following:

```js
{
  state: {}, // test state
  props: {}  // props passed to the computed
}
```

### Example

```js
import {compute} from 'cerebral'
import {props, state} from 'cerebral/tags'
import {runCompute} from 'cerebral/test'

import Multiply from './Multiply'

it('should multiply by the specified number', () => {
  const multiply = Multiply(state`number`, props`number`)
  const result = runCompute(multiply, {
    state: { number: 5 },
    props: { number: 2 }
  })
  assert.equal(result, 10)
})
```

## Actions

The `runAction` test helper accepts a `action` and `fixture` arguments and returns a promise.

```js
runAction(action, fixture).then((result) => {})
```

The optional `fixture` argument should be an object that contains any of the following:

```js
{
  state: {}, // test state
  props: {}, // props passed to the action
  // any other options that can be passed to the
  // cerebral controller, including router, providers...
}
```

The `result` object passed when the promise resolves contains `state`, `controller`, `props` and `output` properties.

```
{
  state,
  controller,
  props: {
    // props data received by action
  },
  output: {
    // action output data
  }
}
```

### Example

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import {runAction} from 'cerebral/test'

import Increment from './Increment'

it('should increment numbers in state', () => {
  const increment = Increment(state`number`)

  return runAction(increment, { state: { number: 1 } })
    .then(({state}) => assert.equal(state.number, 2))
})
```

## Signals

The `runSignal` test helper accepts a `signal` (chain of actions) and `fixture` arguments and returns a promise.

```js
runSignal(signal, fixture. options).then((result) => {})
```

The optional `fixture` argument should be an object that contains any of the following:

```js
{
  state: {}, // test state
  props: {}, // props passed to the signal
  // any other options that can be passed to the
  // cerebral controller, including router, providers...
}
```

The optional `options` argument contain the the following options:

`recordActions: true|false|'byName'`

When `recordActions: true` is specified each action will record its props/output against its index within the signal action chain. When `recordActions: 'byName'` is specified each action will record its output against an named property in the result.

The `result` object passed when the promise resolves contains `state`, `controller` and an object for each named action in the signal chain with the same name as the actions with `props` and `output` properties.

```
{
  state,
  controller,
  '2': {
    props: {
      // props data
    },
    output: {
      // action output data
    }
  },
  '1': {
    props: {
      // props data
    },
    output: {
      // action output data
    }
  }
}
```

### Example

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import {runSignal} from 'cerebral/test'

// the buttonClicked signal has two actions: validateForm and updateIsValid
import buttonClicked from './buttonClick'

it('should handle button clicks', () => {
  const fixture = {
    state: { isValid: false },
    props: { buttonName: 'submit' }
  }
  return runSignal(buttonClicked, fixture, {recordActions: 'byName'})
    .then(({validateForm, updateIsValid, state}) => {
      assert.equal(validateForm.props.buttonName, 'submit')
      assert.equal(updateIsValid.props.isValid, true)
      assert.equal(state.isValid, true)
    })
})
```
