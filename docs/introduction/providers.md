# Providers

```marksy
<Youtube url="https://www.youtube.com/embed/Fa8XcfnQl_o" />
```

Providers is a term in Cerebral that basically means _side effects_. Everything from talking to the server, browser APIs etc. should be contained in a provider. This is also related to organizing your applicatio, but as you will see soon we also get other benefits with this approach.

In our application we want to talk to JSONPlaceholder and for that we need a provider. Cerebral has an addon called **@cerebral/http** which could help us here, but let us rather build our own.

Create a new file in `src/main` named **providers.js**. In this file let us add:

```js
import { Provider } from 'cerebral'

export const jsonPlaceholder = Provider({
  getUser(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => response.json())
      .then((user) => ({ user }))
  }
})
```

We have now created a provider that uses the native [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) of the browser to grab a user from JSONPlaceholder. Instead of creating a generic http provider we went all the way and created a specific provider for talking to JSONPlaceholder. The concept of a provider allows us to do this and it is highly encouraged as it will improve the readability of your code.

We expose providers to Cerebral by adding them to modules. Any module can add a provider. We will add ours to the root module in `src/main/index.js`.

```js
import { Module } from 'cerebral'
import * as providers from './providers'

export default Module({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  providers
})
```

We are now ready to make some stuff happen in our application!
