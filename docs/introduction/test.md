# Test

Cerebral makes it easy to test your application components and business logic.

## Components
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

## Computes

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

## Actions

The `runAction` test helper accepts the `action` and `fixture` arguments and returns a promise.

```js
import {state} from 'cerebral/tags'
import {runAction} from 'cerebral/test'

import increment from './increment'

it('should increment numbers in state', () => {
  return runAction(increment, { state: { number: 1 } })
    .then(({state}) => assert.equal(state.number, 2))
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

## Signals

The `CerebralTest` factory returns `runSignal`, `setState` and `getState` functions as well as the controller.

```js
import { CerebralTest } from 'cerebral/test'
import math from './math'

it('should accumulate a count', () => {
  const cerebral = CerebralTest(math) // Expects a Module

  cerebral.setState('count', 0)

  return cerebral.runSignal('plusOne')
    .then(({ state }) => {
      assert.equal(state.math.count, 1)

      return cerebral.runSignal('plus', { value: 2 })
        .then(() => {
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

### Options
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

  return cerebral.runSignal('plusOne', {
    incrementBy: 1
  })
    .then(({ increment }) => {
      assert.equal(increment.props.incrementBy, 1)
  })
})
```

When `recordActions: true` is specified each action will record its props/output against its index within the signal action chain. When `recordActions: 'byName'` is specified each action will record its output against an named property in the result.

The `result` object passed when the promise resolves contains `state`, `controller` and an object for each named action in the signal chain with the same name as the actions with `props` and `output` properties.
