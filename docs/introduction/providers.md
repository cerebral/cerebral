# Providers

```marksy
<Youtube url="https://www.youtube.com/embed/Fa8XcfnQl_o" />
```

Providers are added to the context of every action executed by a signal. Providers can be everything from a tool you are already using, to something Cerebral specific. **The point of providers is to separate side effects from execution**. That means you can create all the logic you want in actions without creating any dependencies to other tools. This makes them highly testable and generally gives you more flexibility.

## The default providers

Cerebral has a set of default providers:

* **props** - The data passed into execution and/or returned from actions
* **state** - The API that changes the state of your application
* **module** - Change the state of the module running the signal
* **controller** - Access to the controller instance inside an action
* **resolve** - Ability to resolve tags and computed inside actions

All these can be accessed inside an action:

```js
export function someAction({ props, state, controller, resolve }) {}
```

The [devtools](/docs/api/devtools) also adds its own provider called **debugger**.

## Adding a provider

If you are using libraries where you want access to everything they provide you can simply add them as a provider using an object:

```js
import { Module } from 'cerebral'
import axios from 'axios'
import uuid from 'uuid'

export default Module({
  state: {},
  signals: {},
  providers: {
    axios,
    uuid
  }
})
```

Though you will get benefits by using the **Provider** factory from Cerebral. This will track its usage and also encourages you to create a specific API for your application to run the side effects. For example:

```js
import { Controller, Provider } from 'cerebral'
import axios from 'axios'

const http = Provider({
  get(...args) {
    return axios.get(...args)
  },
  post(...args) {
    return axios.post(...args)
  }
})

export default Module({
  state: {},
  signals: {},
  providers: {
    http
  }
})
```

**It does not matter what module exposes the provider, all providers are global. That means any provider defined is available in any action in the application.**

You can use providers for pretty much anything, though typically it is to handle some kind of side effect. Examples of providers are [@cerebral/storage](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/@cerebral/storage), [@cerebral/firebase](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/@cerebral/firebase) and [@cerebral/http](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/@cerebral/http).

As mentioned above we use providers to separate side effects from execution, allowing us to provide our own custom API to our application.

```marksy
<CodeSandbox url="https://codesandbox.io/embed/mq5k42x5nj?view=editor" />
```
