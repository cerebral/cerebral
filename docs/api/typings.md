# Typescript usage

## Actions

```typescript
import { Action, ActionChain, ActionFactory, ActionChain } from 'cerebral'

const actionFactory: ActionFactory = (foo: string) => {
    return ({state, props}) => {
        // manage state and props
    })
}

const simpleAction: Action = ({ state, props }) => {
    // manage state and props
}

const actionArray: ActionChain = [
    actionFactory('foo'),
    simpleAction
]
```

## Compute

```typescript
import { Compute, compute, ValueResolver } from 'cerebral'
import { state } from 'cerebral'

const someComputed: Compute = compute(
  state`foo`,
  (foo: string, get: ValueResolver) => ({
    bar: foo + get(state`bar`)
  })
)
```

## Signals

```typescript
import { SignalChain } from 'cerebral'

const someSignal: SignalChain = [
  actionFactory,
  simpleAction,
  someComputed,
  actionArray
]
```

## Modules

```typescript
import { Module } from 'cerebral'

export const module1: Module = {
  state: { foo: 'bar' },
  signals: {
    foo: [someAction]
  }
}

export const module2: Module = (module) => {
  module.name = 'module2'
  return {
    state: {
      foo: 'bar'
    }
  }
}
```

## Controller

```typescript
import { Controller, ControllerClass, Signal, StateModel } from 'cerebral'

const controller: ControllerClass = Controller({
  state: {},
  signals: {
    someSignal
  },
  modules: {
    module1,
    module2
  }
})

const someSignalCallable: Signal = controller.getSignal('someSignal')
const stateModel: StateModel = controller.getModel()
```
