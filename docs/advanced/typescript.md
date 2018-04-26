# Typescript

Cerebral supports full type safety in your application. It is recommended to use [React]() as you will continue to use the types there. You can gradually add type safety to Cerebral so let us take this step by step.

## Preparing typing

Cerebral uses its proxy concept to effectively type your state and signals. To attach the types to these proxies you will need to create a file called **cerebral.proxy.ts**:

```ts
import { IContext } from 'cerebral'
import * as proxy from 'cerebral/proxy'

type State = {}

type Signals = {}

export interface Context extends IContext {
  state: State
}

export const state = proxy.state as State

export const path = proxy.path as State

export const signals = proxy.signals as Signals
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

## Typing state

Typically you want to create a **types.ts** file next to your modules. This is where you will define the state types.

_app/types.ts_

```ts
export type State = {
  title: string
  isAwesome: true
}
```

This type can now be used in your module to ensure type safety:

_app/index.ts_

```ts
import { Module } from 'cerebral'
import { State } from './types'

const state: State = {
  title: 'My project',
  isAwesome: true
}

export default Module({
  state
})
```

In your **cerebral.proxy** file you can now compose state from all your modules:

```ts
import * as proxy from 'cerebral/proxy'
import { State as AppState } from './app/types'
import { State as ModuleAState } from './app/modules/moduleA/types'
import { State as ModuleBState } from './app/modules/moduleB/types'

type State = AppState & {
  moduleA: ModuleAState
  moduleB: ModuleBState
}
type Signals = {}

export const state = proxy.state as State
export const path = proxy.path as State
export const signals = proxy.signals as Signals
```

## Typing actions
