# Test

## Snapshot testing (beta)

Snapshot testing requires your application to be written in Cerebral version 4 or up. All the providers you use needs to be defined using the `Provider` API, or you will have to mock out things yourself.

### Introduction

**1. Run the signal**

Open up your app and run the signal you want to test.

**2. Create test in debugger**

In the debugger there is a button in the signal list called "Create signal test". Select the signal you just triggered and click this button. The test is copied to the clipboard.

**3. Run test**

It is recommended to use [JEST](https://facebook.github.io/jest/). Just paste what you have in your clipboard and it will look something like this.

```js
test('should filter on all', () => {
  return Snapshot(app) // app is the root module
    .run('filterClicked', { filter: 'all' })
    .then(snapshot => {
      expect(snapshot.get()).toMatchSnapshot()
    })
})
```

Run the test to create the first snapshot. Any changes to your app that affects this signal will be yelled at you by Jest.

### Snapshot

Creates the test and returns a promise. Pass it the root module of your application.

```js
Snapshot(app)
```

### run

Runs a signal with an optional payload. It returns a promise, passing the snapshot.

```js
Snapshot(app)
  .run('some.signal', { foo: 'bar' })
  .then(snapshot => {})
```

### mutate

Runs a mutation in the state store before the signal runs.

```js
Snapshot(app).mutate('set', 'some.state.path', 'someValue')
```

### mock

Mocks out a provider that will be called in the signal. Can give an optional return value. If provider is called multiple times, you will need multiple calls to mock.

```js
Snapshot(app).mock('someProvider.someMethod', 'someReturnedValue')
```

### mockResolvedPromise

Mocks out a provider with a returned promise that resolves with an optional value.

```js
Snapshot(app).mockResolvedPromise(
  'someProvider.someMethod',
  'someReturnedValue'
)
```

### mockRejectedPromise

Mocks out a provider with a returned promise that rejects with an optional value.

```js
Snapshot(app).mockRejectedPromise(
  'someProvider.someMethod',
  'someReturnedValue'
)
```

## Assertion

### Components

The **Container** you use to expose Cerebral to your components can also be used when testing. This is beneficial if you want to test
a section of your UI interacts correctly with the controller.

```js
import React from 'react'
import { mount } from 'enzyme'
import assert from 'assert'
import { Container } from '@cerebral/react'
import { Controller, Module } from 'cerebral'

import Button from './Button'

describe('<Button />', () => {
  it('should pass foo state on click', () => {
    const testModule = Module({
      state: {
        foo: 'bar'
      },
      signals: {
        clicked: ({ props }) => assert.equal(props.foo, 'bar')
      }
    })
    const controller = Controller(app)
    const wrapper = mount(
      <Container controller={controller}>
        <Button />
      </Container>
    )
    expect(wrapper.find('.foo')).to.have.length(1)
  })
})
```

### Computes

The `runCompute` test helper accepts the `compute` and `fixture` arguments and returns the compute output.

```js
import { props, state } from 'cerebral/tags'
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
import { state } from 'cerebral/tags'
import { runAction } from 'cerebral/test'

import increment from './increment'

it('should increment numbers in state', () => {
  return runAction(increment, { state: { number: 1 } }).then(({ state }) =>
    assert.equal(state.number, 2)
  )
})
```

The `result` object passed when the promise resolves contains `state`, `controller`, `props` and `output` properties.

```js
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

### Signals

The `CerebralTest` factory returns `runSignal`, `setState` and `getState` functions as well as the controller.

```js
import { CerebralTest } from 'cerebral/test'
import math from './math'

it('should accumulate a count', () => {
  const cerebral = CerebralTest(math) // Expects a Module

  cerebral.setState('count', 0)

  return cerebral.runSignal('plusOne').then(({ state }) => {
    assert.equal(state.count, 1)

    return cerebral.runSignal('plus', { value: 2 }).then(() => {
      assert.equal(cerebral.getState('count'), 3)
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
  const cerebral = CerebralTest(math, {
    recordActions: 'byName'
  })

  cerebral.setState('count', 0)

  return cerebral
    .runSignal('plusOne', {
      incrementBy: 1
    })
    .then(({ increment }) => {
      assert.equal(increment.props.incrementBy, 1)
    })
})
```

When `recordActions: true` is specified each action will record its props/output against its index within the signal action chain. When `recordActions: 'byName'` is specified each action will record its output against an named property in the result.

The `result` object passed when the promise resolves contains `state`, `controller` and an object for each named action in the signal chain with the same name as the actions with `props` and `output` properties.
