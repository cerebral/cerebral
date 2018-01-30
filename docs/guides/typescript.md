# Typescript

To get full type safety with Cerebral you should install the `@cerebral/fluent` addon.

`npm install @cerebral/fluent`

This addon exposes its own set of Cerebral APIs that allows for type safety. In this guide we will go through how you would structure an application with this API.

## Controller

Instantiate the **Controller** exposed by `fluent`:

```ts
import Devtools from 'cerebral/devtools'
import { Controller } from '@cerebral/fluent`
import { app } from './app'
import { State, Signals } from './app/types'

export const controller = Controller<State, Signals>(app, {
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

## Creating the app module

Your main module is typically a "manager". It means it is used to configure your general application. There are two parts to this:

1. The module file that composes together all your modules and providers. It also exposes the function that your components will use to connect to the state and the signals of the app

2. The types file which is where you compose together all the state and signals types from your modules. It also exports context types for your sequences and actions

*src/app/index.ts*
```ts
import { Module, ConnectFactory } from '@cerebral/fluent'
import { moduleA } from './modules/moduleA'
import { moduleB } from './modules/moduleB'
import HttpProvider from '@cerebral/http'
import { State, Signals } from './types'

export function connect<Props>() {
  return ConnectFactory<Props, State, Signals>()
}

export const app = Module({
  modules: {
    moduleA,
    moduleB
  },
  providers: {
    http: HttpProvider()
  }
})
```

*src/app/types.ts*
```ts
import { FluentContext, FluentContextWithPaths } from '@cerebral/fluent'
import HttpProvider from '@cerebral/http'
import { State as ModuleAState, Signals as ModuleASignals } from './modules/moduleA/types'
import { State as ModuleBState, Signals as ModuleBSignals } from './modules/moduleB/ types'

export type State = {
  moduleA: ModuleAState,
  moduleB: ModuleBState
}

export type Signals = {
  moduleA: ModuleASignals,
  moduleB: ModuleBSignals
}

export type Providers = {
  http: HttpProvider
}

export interface Context<Props> extends FluentContext<Props>, Providers {
  state: State
}

export interface ContextWithPaths<Props, Paths> extends FluentContextWithPaths<Props, Paths>, Providers {
  state: State
}
```

The two contexts you define will be used by sequences and actions to ensure type safety. Notice that they both extend the **Providers** that we also defined.

## Creating domain specific module

A domain specific module is basically a module that holds state and signals related to some domain in your application. For example **admin**.

*src/app/modules/admin/index.ts*
```ts
import { Module, FluentMap } from '@cerebral/fluent'
import { State, Signals } from './types'
import * as sequences from './sequences'

const state: State = {
  isLoadingUsers: false,
  isSubmittingNewUser: false,
  users: FluentMap({}),
  newUserName: ''
}

const signals: Signals = {
  newUserNameChanged: sequences.changeNewUserName,
  newUserNameSubmitted: sequences.submitNewUser
}

export const admin = Module({
  state,
  signals
})
```

By defining your state and signals on their own constants you will get more specific error reporting form typescript.

*src/app/modules/admin/types.ts*
```ts
import { FluentMap, Signal, SignalWithPayload } from '@cerebral/fluent'

export type State = {
  isLoadingUsers: boolean,
  isSubmittingNewUser: boolean,
  users: FluentMap<User>,
  newUserName: string
}

export type Signals = {
  newUserNameChanged: SignalWithPayload<{ name: string }>,
  newUserSubmitted: Signal
}
```

## Creating sequences

```ts
import { Sequence } from '@cerebral/fluent'
import { Context } from '../../types'

export const changeNewUserName = Sequence<Context, { name: string }>(
  s => s
  .action(({ state, props }) => { state.newUserName = props.name })
)
```

This sequence gives you full type safety and autosuggestions. If anything is changed you will be notified about any breaking changes. Though inlining actions like this works it is always a good idea to separate them out.

```ts
import { Sequence } from '@cerebral/fluent'
import { Context } from '../../types'
import * as actions from './actions'

export const changeNewUserName = Sequence<Context, { name: string }>(s => s
  .action(actions.changeNewUserName)
)

export const changeNewUserName = Sequence<Context, { name: string }>(s => s
  .action(actions.setSubmittingUser(true))
  .pathsAction(actions.submitNewUser)
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
import { Context, ContextWithPaths } from '../../types'

// Now you have made this function composable with any
// other sequence, meaning that you can safely reuse it
// wherever you want and instantly be notified is there is a mismatch,
// for example that the action will indeed not receive the name property
export function changeNewUserName ({ state, props }: Context<{ name: string }>) {
  state.newUserName = props.name
}

type User = {
  userName: string
}

// With the ContextWithPaths type you ensure that this action has
// the defined paths available in the sequence it is composed into
export function submitNewUser ({ state, http, path }: ContextWithPaths<void, { success: { user: User }, error: void }>) {
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