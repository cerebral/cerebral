# Providers

```marksy
<Youtube url="https://www.youtube.com/embed/Fa8XcfnQl_o" />
```

Providers are added to the context of every action executed by a signal. Providers can be everything from a tool you are already using, to something Cerebral specific. **The point of providers is to separate side effects from execution**. That means you can create all the logic you want in actions without creating any dependencies to other tools. This makes them highly testable and generally gives you more flexibility.

## The default providers
Cerebral has a set of default providers:

- **props** - The data passed into execution and/or returned from actions
- **state** - The API that changes the state of your application
- **controller** - Access to the controller instance inside an action
- **resolve** - Ability to resolve tags and computed inside actions

All these can be accessed inside an action:

```js
function someAction ({props, state, controller, resolve}) {}
```

The [devtools](/docs/api/devtools) also adds its own provider called **debugger**.

## Adding a provider
If you are using libraries where you want access to everything they provide you can simply add them as a provider using an object:

```js
import {Controller, provide} from 'cerebral'
import axios from 'axios'
import uuid from 'uuid'

const controller = Controller({
  providers: [
    provide('http', axios),
    provide('id', uuid.v4)
  ]
})
```

Note that some tools has a very complex API that is difficult for Cerebral to analyze. With these kinds of tools it is a better idea to create your own provider, exposing APIs that you actually use from the original tool.

You can use providers for pretty much anything, though typically it is to handle some kind of side effect. Examples of providers is [@cerebral/storage](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/@cerebral/storage), [@cerebral/firebase](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/@cerebral/firebase) and [@cerebral/http](https://github.com/cerebral/cerebral/tree/master/packages/node_modules/@cerebral/http).

To use a provider with Cerebral you put it in the providers array:

```js
const controller = Controller({
  providers: [
    StorageProvider(),
    HttpProvider(),
    FirebaseProvider()
  ]
})
```

## Creating a provider

The **provide** factory helps you add your own providers in a simple way:

```js
import {Controller, provide} from 'cerebral'

const controller = Controller({
  providers: [
    provide('someProvider', {
      returnFoo() {
        return 'foo'
      }
    })
  ]
})
```

When using the **provide** factory the provider will automatically be wrapped by the Cerebral devtools, to track its usage in the debugger.

Now this provider is available to any action:

```js
function myAction ({someProvider}) {
  someProvider.returnFoo() // "foo"
}
```

Play around with creating a provider on [this BIN](https://www.webpackbin.com/bins/-KpZNE-A-_O7hjIGqVnL).

As mentioned above we use providers to separate side effects from execution, allowing us to provide our own custom API to our application. The **provide** factory simplifies adding a provider, but you can get more control by defining your own provider function. [Look at the API docs for more information](/docs/api/providers).
