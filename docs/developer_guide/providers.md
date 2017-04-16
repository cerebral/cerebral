# Providers

Providers are added to the context of every action executed by a signal. Providers can be everything from a tool you are already using, to something Cerebral specific. The point of providers is to separate side effects from execution. That means you can create all the logic you want in actions without creating any dependencies to other tools. This makes them highly testable and generally gives you more flexibility.

## Just add a tool
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

## Creating a provider
You can use providers for pretty much anything, though typically it is to handle some kind of side effect. Examples of providers is [cerebral-provider-storage](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-storage), [cerebral-provider-firebase](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-firebase) and [cerebral-provider-http](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-http).

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

The **provide** factory helps you add your own providers in a simple way:

```js
import {Controller, provide} from 'cerebral'

const controller = Controller({
  providers: [
    provide('someProvider', {
      foo: 'bar'
    })
  ]
})
```

When using the **provide** factory the provider will automatically be wrapped by the Cerebral devtools, to track its usage in the debugger.

Now this provider is available to any action:

```js
function myAction ({someProvider}) {
  someProvider.foo // "bar"
}
```

As mentioned above we use providers to separate side effects from execution, allowing us to provide our own custom API to our application. The **provide** factory simplifies adding a provider, you can get more control by defining your own provider function. Look at the API docs for more information.
