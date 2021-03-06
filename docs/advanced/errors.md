# Errors

Currently we are creating a nested structure in our sequence to express conditional execution. Related to errors that does not always make sense, cause you just want to stop execution and do something completely different. Let us revert our sequence back to is original format and then we rather catch the error:

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

export default {
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      set(state`isLoadingUser`, true),
      getUser,
      set(state`users.${props`id`}`, props`user`),
      set(state`currentUserId`, props`id`),
      set(state`isLoadingUser`, false)
    ]
  },
  catch: [
    [Error, set(state`error`, props`error.message`)]
  ],
  providers: {...}
}
```

The **catch** takes a list of error handlers. You define the handler with an error type and the sequence to run, in this case just one action. In this case we are catching any error, but we could be more specific.

```marksy
<Warning>
Notice that the catch handler is an array of arrays. Each item in the array is an array of two items. The type of error to handle and what sequence should handle it.
</Warning>
```

Let us create a **JsonPlaceholderError**:

```js
import { set } from 'cerebral/factories'
import { CerebralError, state, props } from 'cerebral'

class JsonPlaceholderError extends CerebralError {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = 'JsonPlaceholderError'
  }
}

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

export default {
  state: {...},
  sequences: {
    loadUser: [
      set(state`isLoadingUser`, true),
      getUser,
      set(state`users.${props`id`}`, props`user`),
      set(state`currentUserId`, props`id`),
      set(state`isLoadingUser`, false)
    ]
  },
  catch: [
    [JsonPlaceholderError, set(state`error`, props`error.message`)]
  ],
  providers: {...}
}
```

And we can throw it from our provider:

```js
import { Provider } from 'cerebral'
import { JsonPlaceholderError } from './errors'

export const jsonPlaceholder = Provider({
  getUser(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          return response.text().then((message) => {
            throw new JsonPlaceholderError(message, response.status)
          })
        }
      })
      .then((user) => ({ user }))
      .catch((error) => {
        throw new JsonPlaceholderError(error.message, 0)
      })
  }
})
```

Let us force an error to see how it looks. First let us actually handle the error by creating a new sequence in our **sequences.js** file:

```js
import * as actions from './actions'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

export const handleError = set(state`error`, props`error.message`)

export const loadUser = [...]
```

Now let us throw an error when our provider runs:

```js
import { Provider } from 'cerebral'
import { JsonPlaceholderError } from './errors'

export const jsonPlaceholder = Provider({
  getUser(id) {
    throw new JsonPlaceholderError('Wuuut', 0)
    /*
      THE ORIGINAL CODE
    */
  }
})
```

As you can see the debugger indicates when it catches an error and how it is handled. Note that by default Cerebral will not throw to the console when these caught errors occur, but just give you a warning about it. You can force Cerebral to also throw to the console by passing in an option to the controller:

```js
import App from 'cerebral'
import main from './main'

let Devtools = null
if (process.env.NODE_ENV === 'development') {
  Devtools = require('cerebral/devtools').default
}

const app =  App(main, {
  throwToConsole: true,
  devtools: Devtools({
    host: 'localhost:8585'
  })
})
```
