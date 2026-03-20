# TypeScript with Cerebral

```marksy
<Warning>
**IMPORTANT**: Even though Cerebral fully supports TypeScript, you might also want to consider Cerebral's successor, [Overmind](https://overmindjs.org), which was built from the ground up with TypeScript support and modern JavaScript features.
</Warning>
```

Cerebral provides comprehensive type safety for your application. You can add typing gradually, so let's take this step by step. You can stop at any level when you feel you have enough type safety for your needs.

## Required: Setting Up Proxy Support

Cerebral uses proxies for type-safe state and sequences access. To set up these typed proxies, create a file called **app.cerebral.ts**:

```marksy
<Info>
You MUST use the [@cerebral/babel-plugin](https://www.npmjs.com/package/@cerebral/babel-plugin) package. This plugin transforms the typed proxies into template literal tags behind the scenes.
</Info>
```

```ts
import * as cerebral from 'cerebral'

type State = {}

export const props = cerebral.props
export const state = cerebral.state as State
export const sequences = cerebral.sequences
export const moduleState = cerebral.moduleState
export const moduleSequences = cerebral.moduleSequences
```

In your **tsconfig.json**, add paths to make importing this file easier:

```json
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
  "exclude": ["node_modules"]
}
```

## Step 1: Typing State

Create a **types.ts** file next to your modules to define your types:

```ts
// main/types.ts
export type State = {
  title: string
  isAwesome: boolean
}
```

```marksy
<Info>
When you type your **sequences** and **computed** values this way, they automatically incorporate any new additions, making your type system self-updating.
</Info>
```

Use this type in your module definition:

```ts
// main/index.ts
import { ModuleDefinition } from 'cerebral'
import { State } from './types'
import * as sequences from './sequences'
import * as computeds from './computeds'
import * as providers from './providers'

const state: State = {
  title: 'My project',
  isAwesome: computeds.isAwesome
}

const module: ModuleDefinition = {
  state,
  sequences,
  computeds,
  providers
}

export default module
```

For your computed values:

```ts
import { state } from 'cerebral'

// Computed are just functions that receive a 'get' parameter
export const isAwesome = (get) => {
  const value = get(state.isAwesome)
  return value + '!!!'
}
```

In your **app.cerebral.ts**, compose state from all modules:

```ts
import * as cerebral from 'cerebral'
import * as Main from './main/types'
import * as ModuleA from './main/modules/moduleA/types'

type State = Main.State & {
  moduleA: ModuleA.State
}

export const props = cerebral.props
export const state = cerebral.state as State
export const sequences = cerebral.sequences
export const moduleState = cerebral.moduleState
export const moduleSequences = cerebral.moduleSequences
```

When using module-specific proxies, cast them to the appropriate type:

```ts
// main/sequences.ts
import { moduleState as moduleStateProxy } from 'app.cerebral'
import { State } from './types'

const moduleState = moduleStateProxy as State
```

## Step 2: Typing Sequences (Declarative Approach)

The simplest way to type sequences is with the `sequence` factory, which provides typing for execution:

```ts
import { sequence } from 'cerebral/factories'

// Simple sequence
export const mySequence = sequence(actions.myAction)

// Sequence with multiple actions
export const myOtherSequence = sequence([
  actions.someAction,
  actions.someOtherAction
])

// With typed props
export const sequenceWithProps = sequence<{ foo: string }>(actions.myAction)
```

```marksy
<Warning>
This approach doesn't provide complete type checking for props passed between actions. However, it maintains declarative syntax while providing input typing and debugger support, which is often the best balance.
</Warning>
```

Add sequence types to your module's types file:

```ts
// main/types.ts
import * as sequences from './sequences'

export type State = {
  title: string
  isAwesome: boolean
}

export type Sequences = {
  [key in keyof typeof sequences]: (typeof sequences)[key]
}
```

## Step 3: Typing React Components

When using React with Cerebral, there are several ways to type your components:

### Function Components with Dependencies

```ts
import { state, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

const deps = {
  foo: state.foo,
  onClick: sequences.onClick
}

export const MyComponent: React.FC<typeof deps & ConnectedProps> = ({
  foo,
  bar,
  onClick
}) => {
  return <div onClick={() => onClick()}>{foo}</div>
}

export default connect(deps, MyComponent)
```

### Class Components with Dependencies

```ts
import { state, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

const deps = {
  foo: state.foo,
  onClick: sequences.onClick
}

class MyComponent extends React.Component<typeof deps & ConnectedProps> {
  render() {
    const { foo, bar, onClick } = this.props
    return <div onClick={() => onClick()}>{foo}</div>
  }
}

export default connect(deps, MyComponent)
```

### Components with External Props

```ts
import { state, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

type Props = {
  external: string
}

const deps = {
  foo: state.foo,
  onClick: sequences.onClick
}

export const MyComponent: React.FC<Props & typeof deps & ConnectedProps> = ({
  external,
  foo,
  bar,
  onClick
}) => {
  return <div onClick={() => onClick()}>{external}: {foo}</div>
}

export default connect<Props>(deps, MyComponent)
```

### Dynamic Dependencies

If you need more flexibility, you can use dynamic dependencies:

```ts
import { state, sequences } from 'app.cerebral'
import { connect, ConnectedProps } from '@cerebral/react'

const MyComponent: React.FC<ConnectedProps> = ({ get }) => {
  const foo = get(state.foo)
  const onClick = get(sequences.onClick)

  return <div onClick={() => onClick()}>{foo}</div>
}

export default connect(MyComponent)
```

## Step 4: Typing Actions and Providers

Type your custom providers and add them to your context:

```ts
// main/providers.ts
export const myProvider = {
  get(value: string) {
    return value
  }
}
```

```ts
// main/types.ts
import * as providers from './providers'

export type Providers = {
  [key in keyof typeof providers]: (typeof providers)[key]
}
```

Update your app.cerebral.ts:

```ts
import * as cerebral from 'cerebral'
import * as Main from './main/types'

type State = Main.State

type Providers = Main.Providers

export type Context<Props = {}> = cerebral.IContext<Props> & Providers

export const props = cerebral.props
export const state = cerebral.state as State
// ...other exports
```

Now you can type actions with your context:

```ts
import { Context } from 'app.cerebral'

export function myAction({ store, myProvider }: Context) {
  // Fully typed context
}

// With props
export function actionWithProps({ store, props }: Context<{ foo: string }>) {
  // Typed props
}
```

## Step 5: Advanced Sequence Typing (Chain API)

For complete type safety in sequences, you can use the chaining API. While less declarative, it provides full type checking:

```ts
// In app.cerebral.ts
export type Context<Props = {}> = cerebral.IContext<Props> & Providers
export type BranchContext<Paths, Props = {}> = cerebral.IBranchContext<
  Paths,
  Props
> &
  Providers

export const Sequence = cerebral.ChainSequenceFactory<Context>()
export const SequenceWithProps =
  cerebral.ChainSequenceWithPropsFactory<Context>()
```

Define sequences with full type safety:

```ts
import { Sequence, SequenceWithProps, state } from 'app.cerebral'
import * as actions from './actions'

export const doThis = Sequence((sequence) =>
  sequence
    .action(actions.doSomething)
    .action('doSomethingElse', ({ store }) => store.set(state.foo, 'bar'))
)

export const doThat = SequenceWithProps<{ foo: string }>((sequence) =>
  sequence.action('doThisThing', ({ store, props }) =>
    store.set(state.foo, props.foo)
  )
)
```

```marksy
<Info>
This approach automatically infers props as they're passed between actions, ensuring type safety throughout the entire sequence flow, even when composing sequences together.
</Info>
```

For conditional logic, use branch:

```ts
export const conditionalSequence = Sequence((sequence) =>
  sequence.branch(actions.checkCondition).paths({
    success: (sequence) => sequence.action(actions.onSuccess),
    error: (sequence) => sequence.action(actions.onError)
  })
)
```

Compose sequences with:

```ts
export const composedSequence = Sequence((sequence) =>
  sequence
    .sequence(sequences.someOtherSequence)
    .parallel([sequences.sequenceA, sequences.sequenceB])
)
```

The flow factories are integrated into the chaining API:

```ts
export const delayedSequence = Sequence((sequence) =>
  sequence
    .delay(1000)
    .when(state.foo)
    .paths({
      true: (sequence) => sequence.action(actions.onTrue),
      false: (sequence) => sequence.action(actions.onFalse)
    })
)
```

You can improve action typing for paths:

```ts
import { BranchContext } from 'app.cerebral'

export function checkCondition({
  path
}: BranchContext<{
  success: { result: string }
  error: { error: Error }
}>) {
  // Type-safe path execution
}
```

## Summary

TypeScript integration can be added incrementally to your Cerebral app:

1. Set up the babel plugin and create your app.cerebral.ts file
2. Define and compose state types
3. Use the sequence factory for simple sequence typing
4. Add connect with proper types to your components
5. Type your context for actions and providers
6. (Optional) Use the chain API for maximum type safety

Choose the level of type safety that best fits your project's needs - you can start simple and add more as you go.
