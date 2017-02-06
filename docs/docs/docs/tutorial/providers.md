# Providers

**Load up chapter 09** - [Preview](09)

Good news, we have already used a provider before. Do you remember the *http-provider* we are using to get data from servers?

A provider basically adds itself to the context object of our actions. Let us check out our existing code in *./src/index.js*. Note the *http* - object on the context of the *get* action returned:
```js
...
function getRepoFactory(repoName) {
  function getRepo({http}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then((response) => {
        return {[repoName]: response.result}
      })
      .catch((error) => {
        return {error: error.result}
      })
  }

  return getRepo
}
...
```

## Adding a provider
What needs to be done? Well not too much. Just add the provider in your controller in *./src/index.js*

This is how it looks right now:
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

What are the **benefits** of using a provider in this way? Well, we have decoupled the dependency of the HTTP tool in all our actions, meaning that when testing actions we can just pass in a resolved or rejected promise as **http.get** to simulate a response. As well the **Debugger** can now track and visualize the execution of providers.

Just keep in mind that you could use any library as a provider, we've just used http-provider here because it is very lightweight and has some additional benefits when http-requests need to report back progress and the likes (because it also uses Cerebral-Signals for doing that). Let us add another one. Why not provide additional logging functionality to our actions? Let us use [js-logger](https://github.com/jonnyreeves/js-logger).

## Adding a 3rd party provider
We have already installed the library using npm. Because we add a 3rd-party provider we need to wrap it up into a so-called *ContextProvider* to get the benefits mentioned above.

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
function getRepoFactory(repoName) {
  function getRepo({logger, http}) {
    logger.time(`request ${repoName}`)

    return http.get(`/repos/cerebral/${repoName}`)
      .then(response => {
        logger.timeEnd(`request ${repoName}`)

        return {[repoName]: response.result}
      })
      .catch(error => {
        logger.timeEnd(`request ${repoName}`)

        return {error: error.result}
      })
  }

  return getRepo
}
```

Now run your code and check the console after doing a request do a server.
That's it! You have just successfully integrated another provider!

**Want to dive deeper?** - [Go in depth](../in_depth/providers.md), or move on with the tutorial
