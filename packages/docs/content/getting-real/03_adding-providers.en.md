---
title: Adding providers
---

## Adding providers

You most certainly need some tools when you build your app. Typically you need something to talk to a server, maybe you need to talk to Firebase or other websocket services. You can add any tool using providers.

An example of this is axios to do http requests and uuid to create client side ids:

```js
import {Controller} from 'cerebral'
import {ContextProvider} from 'cerebral/providers'
import axios from 'axios'
import uuid from 'uuid'

const controller = Controller({
  providers: [
    ContextProvider({
      axios,
      uuid
    })
  ]
})
```

The **ContextProvider** allows you to hook any kind of tool and get debugging capabilities out of the box. The provider wraps any methods and will inform the debugger about their usage.

Now axios and uuid is available in any action:

```js
function someAction({axios, uuid}) {

}
```

Some providers are also custom made for Cerebral. For example the [cerebral-provider-firebase](https://github.com/cerebral/cerebral/tree/master/packages/cerebral-provider-firebase).

```js
import {Controller} from 'cerebral'
import FirebaseProvider from 'cerebral-provider-firebase'

const controller = Controller({
  providers: [
    FirebaseProvider({
      // options
    })
  ]
})
```

You can also create your own custom providers.
