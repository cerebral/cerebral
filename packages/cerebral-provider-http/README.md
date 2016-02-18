# cerebral-module-http
HTTP module for Cerebral

### Install

`npm install cerebral-module-http`

### Get started

```js
import Controller from 'cerebral'
import Model from 'cerebral-model-baobab'
import Http from 'cerebral-module-http'

const controller = Controller(Model())

controller.addModules({

  // Can pass any default options which
  // will be used on all requests
  http: Http({
    baseUrl: '/api'
  })
})
```

For other options go to [axios repo](https://github.com/mzabriskie/axios).

### The service
The module exposes a services with all HTTP methods: `get, post, put, delete, patch`. You access these inside actions.

```javascript
function postTodo({state, output, services}) {
  const todo = state.get(['newTodo'])
  services.http.post('/todos', todo)
    .success(output.succes)
    .catch(output.error)
}

export default postTodo;
```

The service returns a promise. Results of the http requests will be passed on an object: `{result, statusCode}`. That means you can easily output to `success` or `error` and grab those values off the input on the next action.

### The action factories
This module also exposes some action factories to express request directly in a signal. You got `get, post, put, patch, delete` available to you.

```js
import httpGet from 'cerebral-module-http/get'
import copy from 'cerebral-addons/copy'

export default [
  [
    httpGet('/users'), {
      success: [
        copy('input:/result', 'state:/users')
      ],
      error: [
        copy('input:/result.message', 'state:/errorMessage')
      ]
    }    
  ]  
]
```

It is also possible to use url-scheme on the action factories to build up the url.

```js
import httpPatch from 'cerebral-module-http/patch'
import httpDelete from 'cerebral-module-http/delete'
import copy from 'cerebral-addons/copy'

export default [
  [
    // The array builds up the url, the last argument grabs
    // the data to be passed on the patch request
    httpPatch(['/users/', 'input:/id'], 'state:/updatedUser'),
    httpDelete(['/todos/', 'input:/id'])
  ]  
]
```
