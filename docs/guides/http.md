# Http

Most application needs some sort of requests going to a server. Cerebral HTTP provider is a simple JSON HTTP library that conforms to the functional nature of Cerebral.

## Configuring the provider

```js
import HttpProvider from '@cerebral/http'

export const http = HttpProvider()
```

```js
import { Module } from 'cerebral'
import * as providers from './providers'

export default Module({
  providers
})
```

By default you really do not have to configure anything. By adding the provider we are ready to make requests inside our actions:

```js
function someAction({ http }) {
  return http.get('/something')
}
```

You might need to set some default headers, or maybe you need to pass cookies to 3rd party urls:

```js
import HttpProvider from '@cerebral/http'

export const http = HttpProvider({
  headers: {
    Authorization: 'token whatevah'
  },
  withCredentials: true
})
```

This configuration makes sure every request has an _Authorization_ header and cookies are passed to any request, also outside the origin.

## Per request configuration

These options are also available when doing specific requests. For example we want to post some data using the url encoded format:

```js
function getUser({ http, state }) {
  return http.post('/user', state.get('form'), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
```

## Handling responses

When you make a request with the HTTP provider it will return an object of:

```js
{
  response: {
    status: 200,
    headers: {},
    result: {}
  }
}
```

When using an action you typically want to name the result and output it to the signal execution:

```js
function getUser({ http }) {
  return http.get('/user').then(({ result }) => ({ user: result }))
}
```

You might also want to diverge execution based on the status:

```js
function getUser({ http, path }) {
  return http.get('/user').then(({ status, result }) => {
    switch (status) {
      case 404:
        return path.notFound()
      case 401:
        return path.unauthorized()
      case 200:
        return path.success({ user: result })
      default:
        return path.error()
    }
  })
}
```

## Taking advantage of operators

Operators allows you to handle HTTP requests directly in the sequence of actions:

```js
import { httpGet } from '@cerebral/http/operators'

export default httpGet('/user')
```

The operator outputs the response to the signal, meaning that **status**, **result** and **headers** will now be available for the next actions. That means you could easily combine this with a Cerebral operator:

```js
import { httpGet } from '@cerebral/http/operators'
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/proxy'

export default [
  httpGet('/user'), set(state.app.user, props.response.result)
]
```

The HTTP operators are actually pretty smart. You can optionally use paths to diverge execution. So if you wanted to speficially handle **success** and **error**, you could do this instead:

```js
import { httpGet } from '@cerebral/http/operators'
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/proxy'

export default [
  httpGet('/user'),
  {
    success: set(state.app.user, props.response.result),
    error: set(state.app.error, props.response.result)
  }
]
```

You can even use status codes as paths by default:

```js
import {httpGet} from '@cerebral/http/operators'
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/proxy'

export default [
  httpGet('/user'), {
    401: set(state.app.isAuthorized, false)
    success: set(state.app.user, props.response.result),
    error: set(state.app.error, props.response.result)
  }
]
```

## Dynamic urls

When using operators it is quite restrictive to use a static url, you might want to build the url based on some state, or maybe a property passed into the signal. You can use tags for this:

```js
import { httpGet } from '@cerebral/http/operators'
import { set } from 'cerebral/operators'
import { string } from 'cerebral/tags'
import { state } from 'cerebral/proxy'

export default httpGet(string`/items/${state.app.currentItem.id}`)
```

## Catching errors

Now, it is encouraged that you write your sequences of actions vertically for readability. So when you do:

```js
import { httpGet } from '@cerebral/http/operators'
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/proxy'

export default [
  httpGet('/user'),
  set(state.app.user, props.response.result)
]
```

You will need a way to handle errors. The HTTP provider actually throws an error in this scenario if something goes wrong and you can catch that error in either a signal specific error handler or a global. Typically you want a global error handler, so let us explore that:

```js
import { Module } from 'controller'
import { HttpProviderError } from '@cerebral/http'
import * as providers from './providers'
import * as signals from './signals'

export default Module({
  providers,
  signals,
  catch: [
    [HttpProviderError, signals.httpErrorThrown]
  ]
})
```

What we basically do here is map HTTP provider errors to a signal. So whenever one of your requests gets into problems, you will be able to handle it inside the **HttpErrorThrown** signal.

The data you get passed in is something similar to:

```js
{
  name: 'HttpProviderError',
  message: 'Some potential error message',
  response: {
    body: 'Message or response body',
    status: 200,
    isAborted: false,
    headers: {},
  },
  stack: '...'  
}
```

## Aborting requests

Sometimes you might need to abort requests, a typical example of this is typeahead. Let us just write out an example here first:

```js
import { set } from 'cerebral/operators'
import { string } from 'cerebral/tags'
import { state, props } from 'cerebral/proxy'
import { httpGet, httpAbort } from '@cerebral/http'
;[
  set(state.searchValue, props.value),
  httpAbort('/search*'),
  debounce(250),
  {
    continue: [
      httpGet(string`/search?value=${state.searchValue}`),
      {
        success: set(state.searchResult, props.response.result),
        error: [],
        abort: []
      }
    ],
    discard: []
  }
]
```

And that is it, you have a typeahead. The **httpAbort** operator just takes a regexp string to decide what possibly running requests that will be aborted.

## File upload

You can also upload files from your signals. Either a file you pass in as props to a signal or directly from the state tree. Files are one of the special value types Cerebral supports. We say special value types because files are not serializable by default.

Upload a file is as simple as:

```js
import { httpUploadFile } from '@cerebral/http/operators'
import { props } from 'cerebral/proxy'

export default httpUploadFile('/upload', props.file)
```

Typically with file upload you want to track the upload progress. You can do this by passing the path of a progress signal you have created as an option:

```js
import { httpUploadFile } from '@cerebral/http/operators'
import { props, signals } from 'cerebral/proxy'

export default [
  httpUploadFile('/upload', props.file, {
    onProgress: signals.files.uploadProgressed
  })
]
```

The progress signal will get the payload of:

```js
{
  progress: 45 // The percentage completed
}
```

Additional options for setting the name, passing additional data and headers are also available:

```js
import { httpUploadFile } from '@cerebral/http/operators'
import { props, signals } from 'cerebral/proxy'

export default [
  httpUploadFile('/upload', props.file, {
    name: 'newImage.png',
    data: state.files.currentMetaData,
    headers: {},
    onProgress: signals.files.uploadProgressed
  })
]
```

You can of course choose to do this at action level instead. It is the same api:

```js
function uploadFile({ props, http }) {
  return http.uploadFile('/upload', props.file)
}
```

## Summary

The Cerebral http provider is a simple provider that gives you access to the most common functionality. You can use any other http library if you want to by just exposing it as a provider. For example:

```js
import { Provider } from 'cerebral'
import axios from 'axios'

export default Provider({
  get(...args) {
    return axios.get(...args)
  }
  // And so on
})
```

The operators of http provider though makes it a natural choice when working with Cerebral.
