# Typescript

Cerebral supports full type safety in your application. It is recommended to use [React](https://reactjs.org/) as you will continue to use the types there. You can gradually add type safety to Cerebral so let us take this step by step. You can stop at any step you want when you feel you have enough type safety in your application.

## Required: Preparing typing

Cerebral uses its proxy concept to type your state and signals. To attach the types to these proxies you will need to create a file called **app.cerebral.ts**:

```ts
import * as cerebral from 'cerebral'

type State = {}

type Compute = {}

export const props = cerebral.props
export const state = cerebral.state as State
export const computed = cerebral.computed as Compute
export const sequences = cerebral.sequences
export const moduleState = cerebral.moduleState
export const moduleComputed = cerebral.moduleComputed
export const moduleSequences = cerebral.moduleSequences
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
      "app.cerebral": ["app.cerebral.ts"]
    }
  },
  "exclude": [
    "node_modules"
  ]
}
```

## Step1: Typing state

Typically you want to create a **types.ts** file next to your modules. This is where you will define your types in general.

*main/types.ts*

```ts
import * as computeds from './computeds'

export type State = {
  title: string
  isAwesome: true
}

export type Compute = { [key in keyof typeof computed]: typeof computed[key] }
```

```marksy
<Info>
The way we type **sequences** and **computed** just exposes the way they are defined. Meaning if you add new computeds and/or sequences they will automatically be typed.
</Info>
```

This type can now be used in your module to ensure type safety:

*main/index.ts*

```ts
import { ModuleDefinition } from 'cerebral'
import { State } from './types'
import * as sequences from './sequences'
import * as computeds from './computeds'
import * as providers from './providers'
import { State } from './types'

const state: State = {
  title: 'My project',
  isAwesome: true
}

const module: ModuleDefinition = {
  state,
  sequences,
  computeds,
  providers
}

export default module
```

In your **app.cerebral** file you can now compose state from all your modules:

```ts
import * as cerebral from 'cerebral'
import * as Main from './main/types'
import * as ModuleA from './main/modules/moduleA/types'

type State = Main.State & {
  moduleA: ModuleA.State
}

type Compute = Main.Compute & {
  moduleA: ModuleA.Compute
}

export const props = cerebral.props
export const state = cerebral.state as State
export const computed = cerebral.computed as Compute
export const sequences = cerebral.sequences
export const moduleState = cerebral.moduleState
export const moduleComputed = cerebral.moduleComputed
export const moduleSequences = cerebral.moduleSequences
```

Since the module type of proxies depends on what module you use them with you need to cast them where they are used:

*main/sequences.ts*
```ts
import { moduleState as moduleStateProxy } from 'app.cerebral'
import { State } from './types'

const moduleState = moduleStateProxy as State
```

## Step2: Typing sequences (declarative)

The most important and common typing that helps you is "how to execute a sequence". By defining all your sequences using the **sequence** or **parallel** factory gives you this typing:

```ts
import { sequence } from 'cerebral/factories'

export const mySequence = sequence(actions.myAction)

export const myOtherSequence = sequence([
  actions.someAction,
  actions.someOtherAction
])
```

To type a sequence with prosp to pass in, just add it:

```ts
import { sequence } from 'cerebral'

export const mySequence = sequence<{ foo: string }>(actions.myAction)
```

Now your components will get type information on how to call the sequences. You are now also free to use all the factories with state typing.

```marksy
<Warning>
This approach does **NOT** give you suggestions and type safety on props. This is just impossible to do with this syntax. That said, the value of keeping the declarativeness, typing the input to the sequence and with the assistance of the debugger this is the recommended approach.
</Warning>
```

*main/types.ts*

```ts
import * as computeds from './computeds'
import * as sequences from './sequences'

export type State = {
  title: string
  isAwesome: true
}

export type Compute = { [key in keyof typeof computed]: typeof computed[key] }

export type Sequences = { [key in keyof typeof sequences]: typeof sequences[key] }
```

## Step3: Typing components

In Cerebral we recommend using React if you intend to type your components. The typing can be inferred automatically, but it is recommended to split your **connect** and the component:

### With dependencies
```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

const deps = {
  foo: state.foo,
  bar: computed.bar,
  onClick: sequences.onClick
}

export const MyComponent: React.SFC<typeof deps & ConnectedProps> = ({ foo, bar, onClick }) => {
  return ...
}

export default connect(deps, MyComponent)
```

This approach allows you to export your components for testing without connecting them. It also writes out better in the different scenarios as you will see soon.

**Using classes:**

```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

const deps = {
  foo: state.foo,
  bar: computed.bar,
  onClick: sequences.onClick
}

class MyComponent extends React.Component<typeof deps & ConnectedProps> {
  render () {
    return null
  }
}

export default connect(deps, MyComponent)
```

### With dependencies and external props

If the component receives external props you need to type those and your dependencies:

```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

type Props = {
  external: string
}

const deps = {
  foo: state.foo,
  bar: computed.bar,
  onClick: sequences.onClick
}

export const MyComponent: React.SFC<Props & typeof deps & ConnectedProps> = ({
  external,
  foo,
  bar,
  onClick
}) => {
  return ...
}

export default connect<Props>(deps, MyComponent)
```

**And with a class:**

```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

type Props = {
  external: string
}

const deps = {
  foo: state.foo,
  bar: computed.bar,
  onClick: sequences.onClick
}

class MyComponent extends React.Component<Props & typeof deps & ConnectedProps> {
  render () {
    return null
  }
}

export default connect<Props>(deps, MyComponent)
```

### Dynamic dependencies

If you choose the dynamic approach there is no need to type the dependencies, though you have to type the connected props:

```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

const MyComponent: React.SFC<ConnectedProps> = ({ get }) => {
  const foo = get(state.foo)
  const bar = get(computed.bar)
  const onClick = get(sequences.onClick)
}

export default connect(MyComponent)
```

**And classes:**

```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

class MyComponent extends React.Component<ConnectedProps> {
  render () {
    const { get } = this.props
    const foo = get(state.foo)
    const bar = get(computed.bar)
    const onClick = get(sequences.onClick)
  }
}

export default connect(MyComponent)
```

### Dynamic dependencies and external props

```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

type Props = {
  external: string
}

const MyComponent: React.SFC<Props & ConnectedProps> = ({ external, get }) => {
  const foo = get(state.foo)
  const bar = get(computed.bar)
  const onClick = get(sequences.onClick)
}

export default connect<Props>(MyComponent)
```

**And classes:**

```ts
import { state, computed, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

type Props = {
  external: string
}

class MyComponent extends React.Component<Props & ConnectedProps> {
  render () {
    const { get, external } = this.props
    const foo = get(state.foo)
    const bar = get(computed.bar)
    const onClick = get(sequences.onClick)
  }
}
```

## Step4: Typing actions and providers

When writing actions you access the context. The default context is already typed and you can add your own provider typings.

*main/providers.ts*
```ts
export const myProvider = {
  get(value: string) {
    return value
  }
}
```

*main/types.ts*

```ts
import * as computeds from './computeds'
import * as sequences from './sequences'
import * as providers from './providers'

export type State = {
  title: string
  isAwesome: true
}

export type Compute = { [key in keyof typeof computed]: typeof computed[key] }

export type Sequences = { [key in keyof typeof sequences]: typeof sequences[key] }

export type Providers = { [key in keyof typeof providers]: typeof providers[key] }
```

```ts
import * as cerebral from 'cerebral'
import * as Main from './main/types'

type State = Main.State

type Sequences = Main.Sequences

type Compute = Main.Compute

type Providers = Main.Providers

export type Context = cerebral.IContext<{}> & Providers

export const props = cerebral.props
export const state = cerebral.state as State
export const computed = cerebral.computed as Compute
export const sequences = cerebral.sequences as Sequences
export const moduleState = cerebral.moduleState
export const moduleComputed = cerebral.moduleComputed
export const moduleSequences = cerebral.moduleSequences
```

When you now create your actions you can attach a context type:

```ts
import { Context } from 'app.cerebral'

export const function myAction ({ store, myProvider }: Context) {

}
```

## Step5: Typing sequences (chain)

To get full type safety in sequences you will need to move to a less declarative chaining api. But the cost gives you the value of full type safety. Note that we are also updating the Context typings here:

```ts
import * as cerebral from 'cerebral'
import * as Main from './main/types'

type State = Main.State

type Sequences = Main.Sequences

type Compute = Main.Compute

type Providers = Main.Providers

export type Context<Props = {}> = cerebral.IContext<Props> & Providers

export type BranchContext<Paths, Props = {}> = cerebral.IBranchContext<Paths, Props> &
  Providers

export const props = cerebral.props
export const Sequence = cerebral.ChainSequenceFactory<Context>()
export const SequenceWithProps = cerebral.ChainSequenceWithPropsFactory<Context>()
export const state = cerebral.state as State
export const computed = cerebral.computed as Compute
export const sequences = cerebral.sequences as Sequences
export const moduleState = cerebral.moduleState
export const moduleComputed = cerebral.moduleComputed
export const moduleSequences = cerebral.moduleSequences
```

When you now define your sequences you will use the exported **Sequence** and **SequenceWithProps** from the **app.cerebral** file:

```ts
import { Sequence, SequenceWithProps, state } from 'app.cerebral'
import * as actions from './actions'

export const doThis = Sequence((sequence) =>
  sequence
    .action(actions.doSomething)
    .action('doSomethingElse', ({ store }) =>
      store.set(state.foo, 'bar')
    )
)

export const doThat = SequenceWithProps<{ foo: string }>((sequence) =>
  sequence.action('doThisThing', ({ store, props }) =>
    store.set(state.foo, props.foo)
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
import { Sequence, state } from 'app.cerebral'
import * as actions from './actions'

export const doThis = Sequence((sequence) => sequence
  .branch(actions.doOneOrTheOther)
  .paths({
    one: (sequence) => sequence,
    other: (sequence) => sequence
  })
)
```

You compose in sequences by:

```ts
import { Sequence, state } from 'app.cerebral'
import * as actions from './actions'

export const doThis = Sequence((sequence) => sequence
  .sequence(sequences.someOtherSequence)
  .parallel([sequences.sequenceA, sequences.sequenceB])
)
```

The flow factories are implemented as part of the chaining API:

```ts
import { Sequence, state } from 'app.cerebral'
import * as actions from './actions'

export const doThis = Sequence((sequence) =>
  sequence
    .delay(1000)
    .when(state.foo)
    .paths({
      true: (sequence) => sequence,
      false: (sequence) => sequence
    })
)
```

With the new action typings you will be able to improve inference in the sequences by:

```ts
import { Context } from 'app.cerebral'

export const function myAction ({ store, myProvider }: Context) {

}

export const function myAction ({ store, myProvider, props }: Context<{ foo: string }>) {

}
```

And if the action triggers a path:

```ts
import { BranchContext } from 'app.cerebral'

export const function myAction ({ store, myProvider, path }: BranchContext<
  {
    success: { foo: string },
    error: { error: string }
  }
>) {

}

export const function myAction ({ store, myProvider, path }: BranchContext<
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
