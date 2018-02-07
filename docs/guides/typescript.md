# Typescript

To get full type safety with Cerebral you should install the `@cerebral/fluent` addon.

`npm install @cerebral/fluent`

This addon exposes its own set of Cerebral APIs that allows for type safety. In this guide we will go through how you would structure an application with this API.

## Controller

Instantiate the **Controller** exposed by `fluent`:

```ts
import Devtools from 'cerebral/devtools'
import { Controller } from '@cerebral/fluent'
import { State, Signals } from './app/types'

export const controller = Controller<State, Signals>(app.module, {
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

## Creating a module types file

You will typically create a separate file for the types. This will hold the types for the state and signals of the given module.

*src/app/types.ts*
```ts
import { Dictionary, ComputedValue } from '@cerebral/fluent'
import * as signals from './sequences'

export type Signals = {
  [key in keyof typeof signals]: typeof signals[key]
};

export type State = {
  foo: string,
  stringDictionary: Dictionary<string>,
  isAwesome: ComputedValue<boolean>
};
```

Signals can be typed by using **typeof** on the sequences of the module. This is a shorthand that will use the defined required props of the sequence as the payload to the signal.

## Creating the app module

*src/app/index.ts*
```ts
import { Module, Dictionary, Computed } from '@cerebral/fluent'
import Router from '@cerebral/router'
import * as a from './modules/a'
import * as b from './modules/b'
import * as signals from './sequences'
import * as computed from './computed'
import { State } from './types'

const state: State = {
  foo: 'bar',
  stringDictionary: Dictionary({
    foo: 'bar',
    bar: 'baz'
  }),
  isAwesome: Computed(computed.isAwesome)
}

export const module = Module({
  state,
  signals,
  modules: {
    a: a.module,
    b: b.module,
    router: Router({...})
  }
})
```

By defining your state in its own variable you will get easier to read error reporting from Typescript.

## Creating the fluent file

To ease development it is recommended to create a **fluent.ts** file which configures your application. This is an example of such a file:

```ts
import { IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory, ConnectFactory } from '@cerebral/fluent'
import { Provider as RouterProvider } from '@cerebral/router';
import { State, Signals } from './app/types'

// Create an interface where you compose your providers
interface Providers {
  router: RouterProvider
}

// Create an interface used with your sequences and actions
export interface Context<Props> extends IContext<Props>, Providers {
  state: State
}

// This interface is used when you define actions that returns a path
export interface BranchContext<Paths, Props> extends IBranchContext<Paths, Props>, Providers {
  state: State
}

// This function is used to connect components to Cerebral
export const connect = ConnectFactory<State, Signals>();

// This function is used to define sequences. You can optionally define
// what you expect the final props to look like. This is useful when composing
// one sequence into an other
export const sequence = SequenceFactory<Context>();

// This function is used to define sequences that expect to receive some initial
// props. You can optionally define what you expect the final props to look like
export const sequenceWithProps = SequenceWithPropsFactory<Context>();
```

## Scaling up to submodules

When you have submodules you will need to compose in the complete state and signals. You do this in the **fluent** file like this:

```ts
import { IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory, ConnectFactory } from '@cerebral/fluent'
import { Provider as RouterProvider } from '@cerebral/router';
import * as app from  './app/types'
import * as admin from './app/modules/admin/types'
import * as dashboard from './app/modules/dashboard/types'

type State = app.State & {
  admin: admin.State,
  dashboard: dashboard.State
}

type Signals = app.Signals & {
  admin: admin.Signals,
  dashboard: dashboard.Signals
}

interface Providers {
  router: RouterProvider
}

export interface Context<Props> extends IContext<Props>, Providers {
  state: State
}

export interface BranchContext<Paths, Props> extends IBranchContext<Paths, Props>, Providers {
  state: State
}

export const connect = ConnectFactory<State, Signals>();

export const sequence = SequenceFactory<Context>();

export const sequenceWithProps = SequenceWithPropsFactory<Context>();
```

## Creating sequences

```ts
// It is recommended to create an alias to your fluent
// file for easier imports. Use the babel alias plugin:
// https://www.npmjs.com/package/babel-plugin-module-alias
import { sequence } from 'fluent'

export const changeFoo = sequence(s => s
  .action(({ state }) => { state.foo = 'bar2' })
)
```

This sequence gives you full type safety and autosuggestions. If anything is changed you will be notified about any breaking changes. Though inlining actions like this works it is recommended to split them out. The reason is that your sequences will read better and you actions will be composable with other sequences by default.

```ts
import { sequence } from 'fluent'
import * as actions from './actions'

export const changeFoo = sequence(s => s
  .action(actions.changeFoo)
)
```

You can branch out to paths by using the **branch** method:

```ts
import { sequence } from 'fluent'

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

If your sequence expects to have props available you can define that:

```ts
import { sequenceWithProps } from 'fluent'
import * as actions from './actions'

export const changeFoo = sequenceWithProps<{ foo: string }>(s => s
  .action(actions.changeFoo)
)
```

You can also define expected props to be produced through the sequence:

```ts
import { sequence, sequenceWithProps } from 'fluent'
import * as actions from './actions'

export const doThis = sequence<{ foo: string }>(s => s
  // This action must return { foo: 'some string' } for the
  // sequence to be valid
  .action(actions.doSomething)
)

export const changeFoo = sequenceWithProps<{ foo: string }, { bar: number }>(s => s
  // This action must return { bar: 123 } to give a valid sequence
  .action(actions.changeFoo)
)
```

Any sequences used as signals will require the signal to be called with the defined props, for example:

```ts
import { sequence, sequenceWithProps } from 'fluent'
import * as actions from './actions'

export const doThis = sequenceWithProps<{ foo: string }>(s => s
  .action(actions.doSomething)
)
```

When you call the signal it will require you to call it with:

```ts
signals.doThis({
  foo: 'bar'
})
```

## Creating actions

```ts
import { Context, BranchContext } from 'fluent'
import { User } from './types'

// Now you have made this function composable with any
// other sequence, meaning that you can safely reuse it
// wherever you want and instantly be notified is there is a mismatch,
// for example that the action will indeed not receive the name property
// by a previous action, sequence or calling the signal
export function changeNewUserName ({ state, props }: Context<{ name: string }>) {
  state.newUserName = props.name
}

// With the BranchContext type you ensure that this action has
// the defined paths available in the sequence it is composed into
export function submitNewUser ({ state, http, path }: BranchContext<{
  success: { user: User },
  error: {}
  }>) {
  return http.post('/users', {
    userName: state.newUserName
  })
    .then(response => path.success({ user: response.result }))
    .catch(() => path.error({}))
}
```

The **Context** does not require you to define props. The **BranchContext** takes a second type argument which would be the props used by the action.

## Connecting components

The **connect** factory you defined in the *fluent.ts* file is used to connect to components like this:

```ts
import * as React from 'react'
import { connect } from 'fluent'

type ExternalProps {
  foo: string
}

export default connect<ExternalProps>()
  .with(({ state, signals, props }) => ({
    foo: state.foo,
    onClick: signals.doThis
  }))
  .to(
    function MyComponent ({ foo, onClick }) {
      return <div></div>
    }
  )
```

The **ExternalProps** are used when the component receives props from a parent. This is optional. It is important to take notice that the **with** method has to return the exact observable values you are using in your component. Meaning that:

```ts
import * as React from 'react'
import { connect } from 'fluent'

export default connect()
  .with(({ state }) => ({
    user: state.user
  }))
  .to(
    function UserName ({ user }) {
      return <div>{user.name}</div>
    }
  )
```

would actually not work. You would have to:

```ts
import * as React from 'react'
import { connect } from 'fluent'

export default connect()
  .with(({ state }) => ({
    user: { name: state.user.name }
  }))
  .to(
    function UserName ({ user }) {
      return <div>{user.name}</div>
    }
  )
```

This is because you have to grab (observe) the values being used in the component. This has the benfit of being explicit and allows for easy extending the connect to work with other view layers. You could also do:

```ts
import * as React from 'react'
import { connect } from 'fluent'

export default connect()
  .with(({ state }) => ({
    user: { ...state.user }
  }))
  .to(
    function UserName ({ user }) {
      return <div>{user.name}</div>
    }
  )
```

As this would indeed "get" all the properties on the user, starting to observe them.

To connect to a class:

```ts
import * as React from 'react'
import { connect } from 'fluent'

export default connect()
  .with(({ state }) => ({
    user: { ...state.user }
  }))
  .toClass(props =>
    class UserName extends React.Component<typeof props> {
      render () {
        return <div>{this.props.user.name}</div>
      }
    }
  )
```

Connecting to a class gives a callback with the prop which you can **typeof** into the component class. This gives type safety and auto suggestions on the props in the component itself.

## Computing values

## Dictionary

