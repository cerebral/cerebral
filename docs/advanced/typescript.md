# Typescript

Cerebral supports full type safety in your application. It is recommended to use [React]() as you will continue to use the types there. You can gradually add type safety to Cerebral so let us take this step by step. You can stop at any step you want when you feel you have enough type safety in your application.

## Required: Preparing typing

Cerebral uses its proxy concept to effectively type your state and signals. To attach the types to these proxies you will need to create a file called **cerebral.proxy.ts**:

```ts
import * as proxy from 'cerebral/proxy'

type State = {}

type Signals = {}

type Computed = {}

export const state = proxy.state as State
export const signals = proxy.signals as Signals
export const computed = proxy.computed as Computed
export const props = proxy.props
```

In your **tsconfig.json** file it is recommended to add paths so that you can import this file more easily:

```js
{
  "compilerOptions": {
    "module": "es2015",
    "target": "es5",
    "jsx": "react",
    "lib": ["es6", "dom"],
    "baseUrl": "./src",
    "paths": {
      "cerebral.proxy": ["cerebral.proxy.ts"]
    }
  },
  "exclude": [
    "node_modules"
  ]
}
```

## Step1: Typing state

Typically you want to create a **types.ts** file next to your modules. This is where you will define your types in general.

_app/types.ts_

```ts
import * as signals from './sequences'
import * as computeds from './computeds'

export type State = {
  title: string
  isAwesome: true
}

export type Signals = { [key in keyof typeof signals]: typeof signals[key] }

export type Computed = { [key in keyof typeof computed]: typeof computed[key] }
```

```marksy
<Info>
The way we type **signals** and **computed** just exposes the way they are defined. Meaning if you add new computeds and/or sequences they will automatically be typed.
</Info>
```

This type can now be used in your module to ensure type safety:

_app/index.ts_

```ts
import { Module } from 'cerebral'
import { State } from './types'
import * as signals from './sequences'
import * as computeds from './computeds'
import { State, Signals Computed } from './types'

export default Module<State, Signals, Computed>({
  state: {
    title: 'My project',
    isAwesome: true
  },
  signals,
  computeds
})
```

In your **cerebral.proxy** file you can now compose state from all your modules:

```ts
import * as proxy from 'cerebral/proxy'
import * as App from './app/types'
import * as ModuleA from './app/modules/moduleA/types'

type State = App.State & {
  moduleA: ModuleA.State
}

type Signals = App.Signals & {
  moduleA: ModuleA.Signals
}

type Computed = App.Computed & {
  moduleA: ModuleA.Computed
}

export const state = proxy.state as State
export const signals = proxy.signals as Signals
export const computed = proxy.computed as Computed
export const props = proxy.props
```

Any usage of proxies should now be imported from **cerebral.proxy**:

```ts
import { state } from 'cerebral.proxy'
import { connect } from '@cerebral/react'

export default connect(
  {
    foo: state.foo
  },
  ({ foo }) => {
    return ...
  }
)
```

## Step2: Typing actions

When writing actions you access the context. The default context is already typed and you can add your own provider typings.

```ts
import { IContext, IBranchContext } from 'cerebral'
import * as proxy from 'cerebral/proxy'
import * as App from './app/types'

type State = App.State

type Signals = App.Signals

type Computed = App.Computed

type Providers = App.Providers

export type Context<Props = {}> = IContext<Props> & Providers

export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> &
  Providers

export const state = proxy.state as State
export const signals = proxy.signals as Signals
export const computed = proxy.computed as Computed
export const props = proxy.props
```

When you now create your actions you can attach a context type:

```ts
import { Context } from 'cerebral.proxy'

export const function myAction ({ operators, myProvider }: Context) {

}

export const function myAction ({ operators, myProvider, props }: Context<{ foo: string }>) {

}
```

And if the action triggers a path:

```ts
import { BranchContext } from 'cerebral.proxy'

export const function myAction ({ operators, myProvider, path }: BranchContext<
  {
    success: { foo: string },
    error: { error: string }
  }
>) {

}

export const function myAction ({ operators, myProvider, path }: BranchContext<
  {
    success: { foo: string },
    error: { error: string }
  },
  {
    someProp: number
  }
>) {

}
```

## Step3: Typing sequences

To get full type safety in signals you will need to move to a less declarative chaining api for the sequences. But the cost gives you the value of full type safety.

```ts
import {
  IContext,
  IBranchContext,
  SequenceFactory,
  SequenceWithPropsFactory
} from 'cerebral'
import * as proxy from 'cerebral/proxy'
import * as App from './app/types'

type State = App.State

type Signals = App.Signals

type Computed = App.Computed

type Providers = App.Providers

export type Context<Props = {}> = IContext<Props> & Providers

export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> &
  Providers

export const sequence = SequenceFactory<Context>()
export const sequenceWithProps = SequenceWithPropsFactory<Context>()
export const state = proxy.state as State
export const signals = proxy.signals as Signals
export const computed = proxy.computed as Computed
export const props = proxy.props
```

When you now define your sequences you will use the exported **sequence** and **sequenceWithProps** from the **cerebral.proxy** file:

```ts
import { sequence, sequenceWithProps, state } from 'cerebral.proxy'
import * as actions from './actions'

export const doThis = sequence((sequence) =>
  sequence
    .action(actions.doSomething)
    .action('doSomethingElse', ({ operators }) =>
      operators.set(state.foo, 'bar')
    )
)

export const doThat = sequenceWithProps<{ foo: string }>((sequence) =>
  sequence.action('doThisThing', ({ operators, props }) =>
    operators.set(state.foo, props.foo)
  )
)
```

```marksy
<Info>
Composing together actions like this will infer what props are available as they are returned from actions and made available to the sequence. Even complete sequences can be composed into another sequence and TypeScript will yell at you if it does not match.
</Info>
```

To run conditional logic you will branch out:

```ts
import { sequence, sequenceWithProps, state } from 'cerebral.proxy'
import * as actions from './actions'

export const doThis = sequence((sequence) =>
  sequence.branch(actions.doOneOrTheOther).paths({
    one: (sequence) => sequence,
    other: (sequence) => sequence
  })
)
```

You compose in sequences by:

```ts
import { sequence, sequenceWithProps, state } from 'cerebral.proxy'
import * as actions from './actions'

export const doThis = sequence((sequence) =>
  sequence
    .sequence(sequences.someOtherSequence)
    .parallel([sequences.sequenceA, sequences.sequenceB])
)
```

The flow factories are implemented as part of the chaining API:

```ts
import { sequence, sequenceWithProps, state } from 'cerebral.proxy'
import * as actions from './actions'

export const doThis = sequence((sequence) =>
  sequence
    .delay(1000)
    .when(state.foo)
    .paths({
      true: (sequence) => sequence,
      false: (sequence) => sequence
    })
)
```

And so on...
