---
title: Providers
---

## 13: Providers

`npm run ch12`

Good news, we have already used a provider before. Do you remember the *http-provider* we are using to get data from servers? 
A provider basically adds itself to the context object of our actions. Let us check out our existing code in *./src/index.js*:
```js
...
function action ({input, state, http, path}) {
    let repo = repoName || input.value
    return http.get(url + repo)
      .then(response => {
        return path.success({
          result: response.result
        })
      })
      .catch(error => {
        return path.error({
          result: error.result
        })
      })
  }
...

``` 
Note the *http* - object on the context.
What needs to be done? Well not too much. Just add the provider in your controller in *./src/index.js*
Thats how it looks right now:
```js
...
    providers: [
      HttpProvider({
        baseUrl: 'https://api.github.com'
      })
    ]
...
```
And of course you should get this provider from somewhere:
```js
import HttpProvider from 'cerebral-provider-http'
```

What are the **benefits** of using a provider in this way?
Well we could now write some **Tests** for our signals providing a mock-http object.
As well the **Debugger** can now track and visualise the execution of providers.

Just keep in mind that you could use any library as an provider, we've just used http-provider here because it is very lightweight and has some additional benefits when http-requests need to report back progress and the like (because it also uses Cerebral-Signals for doing that).

Let us add another one. Why not provide additional logging functionality to our actions?
Let us use [this](https://github.com/jonnyreeves/js-logger) one.

We have already installed the library using npm. So it was sitting there and waiting and now the time is ready to use it!

Because we add a 3rd-party provider we need to wrap it up into a so called *ContextProvider* to get as well the benefits mentioned before.
So please add the following imports to your *./src/index.js*
```js
import logger from 'js-logger'
import { ContextProvider } from 'cerebral/providers'
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

Because we just would like to log to console we can use the logger defaults by using:

```js
logger.useDefaults()
```
Somewhere at the beginning of our *./src/index.js*

Now we have the logger in place so let us use it to track request times:
```js
function GetData (url, repoName) {
  function action ({input, state, http, path, logger}) {
    logger.time('request time')
    let repo = repoName || input.value
    return http.get(url + repo)
      .then(response => {
        logger.timeEnd('request time')
        return path.success({
          result: response.result
        })
      })
      .catch(error => {
        return path.error({
          result: error.result
        })
      })
  }
  action.displayName = `GetData(${url}, ${repoName})`
  return action
}
```
Now run your code and check the console after doing a request do a server.
Thats it! You have just successfully integrated another provider!