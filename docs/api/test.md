# Test

## Snapshot testing (beta)

### Introduction

**1. Run the sequence**

Open up your app and run the sequence you want to test.

**2. Create test in debugger**

In the debugger there is a button in the sequence list called "Create sequence test". Select the sequence you just triggered and click this button. The test is copied to the clipboard.

**3. Run test**

It is recommended to use [JEST](https://facebook.github.io/jest/). Just paste what you have in your clipboard and it will look something like this.

```js
test('should filter on all', () => {
  return Snapshot(main) // main is the main module
    .run('filterClicked', { filter: 'all' })
    .then((snapshot) => {
      expect(snapshot.get()).toMatchSnapshot()
    })
})
```

Run the test to create the first snapshot. Any changes to your app that affects this sequence will be yelled at you by Jest.

### Snapshot

Creates the test and returns a promise. Pass it the main module of your application.

```js
Snapshot(main)
```

### run

Runs a sequence with an optional payload. It returns a promise, passing the snapshot.

```js
Snapshot(main)
  .run('some.sequence', { foo: 'bar' })
  .then((snapshot) => {})
```

### mutate

Runs a mutation in the state store before the sequence runs.

```js
Snapshot(main).mutate('set', 'some.state.path', 'someValue')
```

### mock

Mocks out a provider that will be called in the sequence. Can give an optional return value. If provider is called multiple times, you will need multiple calls to mock.

```js
Snapshot(main).mock('someProvider.someMethod', 'someReturnedValue')
```

The mock can also be a function with `(context, ...args)` signature where args are the arguments passed in the
call to the provider method.

```js
Snapshot(main).mock('someProvider.someMethod', (context, ..args) => {
  // mock operation here
})
```

### mockResolvedPromise

Mocks out a provider with a returned promise that resolves with an optional value.

```js
Snapshot(main).mockResolvedPromise(
  'someProvider.someMethod',
  'someReturnedValue'
)
```

### mockRejectedPromise

Mocks out a provider with a returned promise that rejects with an optional value.

```js
Snapshot(main).mockRejectedPromise(
  'someProvider.someMethod',
  'someReturnedValue'
)
```

## Assertion

### Components

The **Container** you use to expose Cerebral to your components can also be used when testing. This is beneficial if you want to test a section of your UI interacts correctly with the Cerebral app.

```js
import React from 'react'
import { mount } from 'enzyme'
import assert from 'assert'
import { Container } from '@cerebral/react'
import App from 'cerebral'

import Button from './Button'

describe('<Button />', () => {
  it('should pass foo state on click', () => {
    const testModule = () => ({
      state: {
        foo: 'bar'
      },
      sequences: {
        clicked: ({ props }) => assert.equal(props.foo, 'bar')
      }
    })
    const app = App(testModule)
    const wrapper = mount(
      <Container app={app}>
        <Button />
      </Container>
    )
    expect(wrapper.find('.foo')).to.have.length(1)
  })
})
```

### Compute

The `runCompute` test helper accepts the `computed` and `fixture` arguments and returns the computed output.

```js
import { props, state } from 'cerebral'
import { runCompute } from 'cerebral/test'

import multiply from './multiply'

it('should multiply by the specified number', () => {
  const result = runCompute(multiply, {
    state: { number: 5 },
    props: { multiplyBy: 2 }
  })

  assert.equal(result, 10)
})
```

### Actions

The `runAction` test helper accepts the `action` and `fixture` arguments and returns a promise.

```js
import { state } from 'cerebral'
import { runAction } from 'cerebral/test'

import increment from './increment'

it('should increment numbers in state', () => {
  return runAction(increment, { state: { number: 1 } }).then(({ state }) =>
    assert.equal(state.number, 2)
  )
})
```

The `result` object passed when the promise resolves contains `state`, `props` and `output` properties.

```js
{
  state,
  props: {
    // props data received by action
  },
  output: {
    // action output data
  }
}
```

### Sequences

The `CerebralTest` factory returns `runSequence`, `setState` and `getState` functions.

```js
import { CerebralTest } from 'cerebral/test'
import math from './math'

it('should accumulate a count', () => {
  const test = CerebralTest(math) // Expects a Module

  test.setState('count', 0)

  return test.runSequence('plusOne').then(({ state }) => {
    assert.equal(state.count, 1)

    return test.runSequence('plus', { value: 2 }).then(() => {
      assert.equal(test.getState('count'), 3)
    })
  })
})
```

Note that state initialized in a module takes precedence over the state property of a fixture. Example:

```js
const fixture = {
  // Override default state in modules
  state: {
    app: {
      showNavigation: true
    }
  },
  modules: {
    app
  }
}
```

#### Options

The optional `options` argument contain the the following options:

`recordActions: true|false|'byName'`

```js
import { CerebralTest } from 'cerebral/test'
import math from './math'

it('should accumulate a count', () => {
  const test = CerebralTest(math, {
    recordActions: 'byName'
  })

  test.setState('count', 0)

  return test
    .runSequence('plusOne', {
      incrementBy: 1
    })
    .then(({ increment }) => {
      assert.equal(increment.props.incrementBy, 1)
    })
})
```

When `recordActions: true` is specified each action will record its props/output against its index within the sequence. When `recordActions: 'byName'` is specified each action will record its output against an named property in the result.

The `result` object passed when the promise resolves contains `state` and an object for each named action in the sequence with the same name as the actions with `props` and `output` properties.
