# Providers

```marksy
<Youtube url="https://www.youtube.com/embed/Fa8XcfnQl_o" />
```

Providers is a term in Cerebral that basically means _side effects_. Everything from talking to the server, browser APIs etc. should be contained in providers. This has several benefits:

1. You are encouraged to build an explicit API for doing side effects in your application

2. The providers are automatically tracked by the debugger, giving you insight of their usage

3. When running tests a provider is easy to mock and can be automatically mocked by the snapshot tests

In our application we want to talk to a service called [JSONPlaceholder](https://jsonplaceholder.typicode.com/) and for that we need a provider. You can choose any library to talk to the server, but we will just use the browser standard [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'

const API_URL = 'https://jsonplaceholder.typicode.com'

const app = App({
  state: {
    title: 'My Project',
    posts: [],
    users: {},
    userModal: {
      show: false,
      id: null
    },
    isLoadingPosts: false,
    isLoadingUser: false,
    error: null
  },
  providers: {
    api: {
      getPosts() {
        return fetch(`${API_URL}/posts`)
          .then(response => response.toJSON())
      },
      getUser(id) {
        return fetch(`${API_URL}/users/${id}`)
          .then((response) => response.json())
      }
    }
  }  
}, {...})
```

We have now added a provider that uses the native fetch API of the browser to grab posts and users from JSONPlaceholder. Instead of creating a generic http provider we went all the way and created a specific provider for talking to JSONPlaceholder called **api**. The concept of a provider allows us to do this and it is highly encouraged as it will improve the readability of the application code.

We are now ready to make some stuff happen in our application!
