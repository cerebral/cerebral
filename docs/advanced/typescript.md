# Typescript

Cerebral supports full type safety in your application. It is recommended to use [React](https://reactjs.org/) as you will continue to use the types there. You can gradually add type safety to Cerebral so let us take this step by step. You can stop at any step you want when you feel you have enough type safety in your application.

## Required: Preparing typing

Cerebral uses its proxy concept to type your state and signals. To attach the types to these proxies you will need to create a file called **cerebral.proxy.ts**:

```ts
import * as tags from 'cerebral/tags'

type State = {}

type Sequences = {}

type Computed = {}

export const state = tags.state as State
export const signals = tags.sequences as Sequences
export const computed = tags.computed as Computed
export const props = tags.props
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

*main/types.ts*

```ts
import * as computeds from './computeds'

export type State = {
  title: string
  isAwesome: true
}

export type Computed = { [key in keyof typeof computed]: typeof computed[key] }
```

```marksy
<Info>
The way we type **sequences** and **computed** just exposes the way they are defined. Meaning if you add new computeds and/or sequences they will automatically be typed.
</Info>
```

This type can now be used in your module to ensure type safety:

*main/index.ts*

```ts
import { Module } from 'cerebral'
import { State } from './types'
import * as sequences from './sequences'
import * as computeds from './computeds'
import * as providers from './providers'
import { State } from './types'

const state: State = {
  title: 'My project',
  isAwesome: true
}

export default Module({
  state,
  sequences,
  computeds,
  providers
})
```

In your **cerebral.proxy** file you can now compose state from all your modules:

```ts
import * as proxy from 'cerebral/proxy'
import * as Main from './main/types'
import * as ModuleA from './main/modules/moduleA/types'

type State = Main.State & {
  moduleA: ModuleA.State
}

type Computed = Main.Computed & {
  moduleA: ModuleA.Computed
}

export const state = proxy.state as State
export const computed = proxy.computed as Computed
export const sequences = proxy.sequences
export const props = proxy.props
```

## Step2: Typing sequences (declarative)

The most important and common typing that helps you is "how to execute a sequence". By defining all your sequences using the **sequence** or **parallel** factory gives you this typing:

```ts
import { sequence } from 'cerebral'

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


## Step3: Typing components

In Cerebral we recommend using React if you intend to type your components. The typing can be inferred automatically, but it is recommended to split your **connect** and the component:

### With dependencies
```ts
import { state, computed, sequences } from 'cerebral.proxy'
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
import { state, computed, sequences } from 'cerebral.proxy'
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
import { state, computed, sequences } from 'cerebral.proxy'
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
import { state, computed, sequences } from 'cerebral.proxy'
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
import { state, computed, sequences } from 'cerebral.proxy'
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
import { state, computed, sequences } from 'cerebral.proxy'
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
import { state, computed, sequences } from 'cerebral.proxy'
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
import { state, computed, sequences } from 'cerebral.proxy'
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

## Step4: Typing actions

When writing actions you access the context. The default context is already typed and you can add your own provider typings.

```ts
import { IContext, IBranchContext } from 'cerebral'
import * as proxy from 'cerebral/proxy'
import * as Main from './main/types'

type State = Main.State

type Sequences = Main.Sequences

type Computed = Main.Computed

type Providers = Main.Providers

export type Context = IContext<{}> & Providers

export const state = proxy.state as State
export const sequences = proxy.sequences as Sequences
export const computed = proxy.computed as Computed
export const props = proxy.props
```

When you now create your actions you can attach a context type:

```ts
import { Context } from 'cerebral.proxy'

export const function myAction ({ store, myProvider }: Context) {

}
```

## Step5: Typing sequences (chain)

To get full type safety in sequences you will need to move to a less declarative chaining api. But the cost gives you the value of full type safety. Note that we are also updating the Context typings here:

```ts
import {
  IContext,
  IBranchContext,
  ChainSequenceFactory,
  ChainSequenceWithPropsFactory
} from 'cerebral'
import * as proxy from 'cerebral/proxy'
import * as Main from './main/types'

type State = Main.State

type Sequences = Main.Sequences

type Computed = Main.Computed

type Providers = Main.Providers

export type Context<Props = {}> = IContext<Props> & Providers

export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> &
  Providers

export const Sequence = ChainSequenceFactory<Context>()
export const SequenceWithProps = ChainSequenceWithPropsFactory<Context>()
export const state = proxy.state as State
export const sequences = proxy.sequences as Sequences
export const computed = proxy.computed as Computed
export const props = proxy.props
```

When you now define your sequences you will use the exported **Sequence** and **SequenceWithProps** from the **cerebral.proxy** file:

```ts
import { Sequence, SequenceWithProps, state } from 'cerebral.proxy'
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
import { Sequence, state } from 'cerebral.proxy'
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
import { Sequence, state } from 'cerebral.proxy'
import * as actions from './actions'

export const doThis = Sequence((sequence) => sequence
  .sequence(sequences.someOtherSequence)
  .parallel([sequences.sequenceA, sequences.sequenceB])
)
```

The flow factories are implemented as part of the chaining API:

```ts
import { Sequence, state } from 'cerebral.proxy'
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
import { Context } from 'cerebral.proxy'

export const function myAction ({ store, myProvider }: Context) {

}

export const function myAction ({ store, myProvider, props }: Context<{ foo: string }>) {

}
```

And if the action triggers a path:

```ts
import { BranchContext } from 'cerebral.proxy'

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
