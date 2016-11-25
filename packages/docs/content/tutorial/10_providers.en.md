---
title: ch09. Providers
---

## Providers

**Load up chapter 09** - [Preview](09)

Good news, we have already used a provider before. Do you remember the *http-provider* we are using to get data from servers?

A provider basically adds itself to the context object of our actions. Let us check out our existing code in *./src/index.js*:
```js
...
function getRepo(repoName) {
  function get({http, path}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then(response => path.success({data: response.result}))
      .catch(error => path.error({data: error.result}))
  }

  return get
}
...
```
Note the *http* - object on the context of the *get* action returned.

What needs to be done? Well not too much. Just add the provider in your controller in *./src/index.js*

Thats how it looks right now:
```js
...
import HttpProvider from 'cerebral-provider-http'
...
    providers: [
      HttpProvider({
        baseUrl: 'https://api.github.com'
      })
    ]
...
```

What are the **benefits** of using a provider in this way? Well we have decoupled the dependency of the HTTP tool in all our actions, meaning that when testing actions we can just pass in a fake HTTP tool. As well the **Debugger** can now track and visualize the execution of providers.

Just keep in mind that you could use any library as an provider, we've just used http-provider here because it is very lightweight and has some additional benefits when http-requests need to report back progress and the like (because it also uses Cerebral-Signals for doing that). Let us add another one. Why not provide additional logging functionality to our actions? Let us use [js-logger](https://github.com/jonnyreeves/js-logger) one.

We have already installed the library using npm. So it was sitting there and waiting and now the time is ready to use it!

Because we add a 3rd-party provider we need to wrap it up into a so called *ContextProvider* to get the benefits mentioned before.

So please add the following imports to your *./src/index.js*
```js
...
import logger from 'js-logger'
import {ContextProvider} from 'cerebral/providers'
...
logger.useDefaults()
...
```

Now we are ready to register it to our controller:
```js
...
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    }),
    ContextProvider({
      logger
    })
  ]
...
```

Now we have the logger in place so let us use it to track request times:
```js
function getRepo(repoName) {
  function get({logger, http, path}) {
    logger.time(`request ${repoName}`)
    return http.get(`/repos/cerebral/${repoName}`)
      .then(response => {
        logger.timeEnd(`request ${repoName}`)
        return path.success({data: response.result})
      })
      .catch(error => {
        logger.timeEnd(`request ${repoName}`)
        return path.error({data: error.result})
      })
  }

  return get
}
```

Now run your code and check the console after doing a request do a server.
Thats it! You have just successfully integrated another provider!

**Want to dive deeper?** - [Go in depth](../in-depth/07_providers.html), or move on with the tutorial
