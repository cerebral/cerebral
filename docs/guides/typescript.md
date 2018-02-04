# Typescript

To get full type safety with Cerebral you should install the `@cerebral/fluent` addon.

`npm install @cerebral/fluent`

This addon exposes its own set of Cerebral APIs that allows for type safety. In this guide we will go through how you would structure an application with this API.

## Controller

Instantiate the **Controller** exposed by `fluent`:

```ts
import Devtools from 'cerebral/devtools'
import { Controller } from '@cerebral/fluent`
import * as app from './app'

export const controller = Controller<app.State, app.Signals>(app.module, {
  devtools: Devtools(...)
})
```

It is optional to define the **State** and **Signals** type on the controller. This is only useful if you point to the state or the signal on the controller itself:

```ts
controller.state
controller.signals
```

## Exposing the controller to React

You also expose the **Container** from `fluent`:

```ts
import * as React from 'react'
import { render } from 'react-dom'
import { controller } from './controller'
import { Container } from '@cerebral/fluent'
import { App } from './components/App'

render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.querySelector('#app')
)
```

## Creating the fluent file

To ease development it is recommended to create a **fluent.ts** file which configures your application. This is an example of such a file:

```ts
import { IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory, ConnectFactory } from '@cerebral/fluent'
import { State, Signals, Providers } from './app'

// This interface is used when you define actions
export interface Context<Props> extends IContext<Props>, Providers {
  state: State
}

// This interface is used when you define actions that returns a path
export interface BranchContext<Paths, Props> extends IBranchContext<Paths, Props>, Providers {
  state: State
}

// This function is used to connect components to Cerebral
export function connect<Props>() {
  return ConnectFactory<Props, State, Signals>();
}

// This function is used to define sequences. You can optionally define
// what you expect the final props to look like. This is useful when composing
// one sequence into an other
export function sequense<ReturnProps = {}>() {
  return SequenceFactory<Context, Output>()
}

// This function is used to define sequences that expect to receive some initial
// props. You can optionally define what you expect the final props to look like
export function sequenseWithProps<Props, ReturnProps = Props>() {
  return SequenceWithPropsFactory<Context, Props, ReturnProps>()
}
```

## Creating the app module

The main application module is really no different than the other modules, but it usually holds the providers as well. What to take notice of here is how we compose in the state and signals types of sub modules.

*src/app/index.ts*
```ts
import { Module, ConnectFactory } from '@cerebral/fluent'
import * as a from './modules/a'
import * as b from './modules/b'
import * as signals from './sequences'
import HttpProvider from '@cerebral/http'

// We export the type of providers added
export type Providers = {
  http: HttpProvider
}

// We export the state of this module a long
// with the state of any submodules
export type State = ModuleState & {
  a: a.State,
  b: b.State
}

// We export the signals of this module a long
// with the signals of any submodules
export type Signals = ModuleSignals & {
  a: a.Signals,
  b: b.Signals
}

// This is an implicit way to define the signals type
// based on the import above from the "sequences" file
type ModuleSignals = {
  [key in keyof typeof signals]: typeof signals[key]
}

// Define this modules state
type ModuleState = {
  isLoading: boolean
}

// Define the initial state as a constant to get
// better error reporting when inserting wrong state
const state: ModuleState = {
  isLoading: true
}

// Define the module as normal
export const module = Module({
  state,
  signals,
  modules: {
    a: a.module,
    b: b.module
  },
  providers: {
    http: HttpProvider()
  }
})
```

The other modules are created the exact same way as this module, composing in any submodules they might have. You might want to split the types into its own **types.ts** file and that is perfectly okay. Just notice that we export **State** as the composed state of any submodules, while **ModuleState** is the state for the specific module.

## Creating sequences

```ts
// It is recommended to create an alias to your fluent
// file for easier imports
import { sequenceWithProps } from 'fluent'

export const changeNewUserName = sequenceWithProps<{ name: string }>(
  s => s
  .action(({ state, props }) => { state.newUserName = props.name })
)
```

This sequence gives you full type safety and autosuggestions. If anything is changed you will be notified about any breaking changes. Though inlining actions like this works it is always a good idea to separate them out.

```ts
import { sequence, sequenceWithProps } from 'fluent'
import * as actions from './actions'

export const changeNewUserName = sequenceWithProps<{ name: string }>(s => s
  .action(actions.changeNewUserName)
)

export const submitUser = sequence(s => s
  .action(actions.setSubmittingUser(true))
  .branch(actions.submitNewUser)
  .paths({
    success: s => s
      .action(actions.addNewUser),
    error: s => s
      .action(actions.showError)
  })
  .action(actions.setSubmittingUser(false))
)
```

## Creating actions

```ts
import { Context, BranchContext } from '../../types'

// Now you have made this function composable with any
// other sequence, meaning that you can safely reuse it
// wherever you want and instantly be notified is there is a mismatch,
// for example that the action will indeed not receive the name property
export function changeNewUserName ({ state, props }: Context<{ name: string }>) {
  state.newUserName = props.name
}

// With the BranchContext type you ensure that this action has
// the defined paths available in the sequence it is composed into
export function submitNewUser ({ state, http, path }: BranchContext<{
  success: { user: { userName: string } },
  error: {}
  }>) {
  return http.post('/users', {
    userName: state.newUserName
  })
    .then(response => path.success({ user: response.result }))
    .catch(() => path.error({}))
}
```

## Connecting components

## Computing values

## Fluent Map

## Scaling up