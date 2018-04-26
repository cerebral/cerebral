# Errors

```marksy
<Youtube url="https://www.youtube.com/embed/UdVjsKQLybw" />
```

Currently we are creating a nested structure in our signal to express conditional execution. Related to errors that does not always make sense, cause you just want to stop execution and do something completely different. Let us revert our sequence back to is original format:

```js
import * as actions from './actions'
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/proxy'

export const loadUser = [
  set(state.isLoadingUser, true),
  actions.getUser,
  set(state.users[props.id], props.user),
  set(state.currentUserId, props.id),
  set(state.isLoadingUser, false)
]
```

and then we rather catch errors in the module file. Look at `src/app/index.js`:

```js
import { Module } from 'cerebral'
import { jsonPlaceholder } from './providers'
import { loadUser, handleError } from './sequences'

export default Module({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false
  },
  signals: {
    loadUser
  },
  catch: [[Error, handleError]],
  providers: {
    jsonPlaceholder
  }
})
```

The **catch** takes a list of error handlers. You give the handler the error type and the sequence to handle it. In this case we are catching any error, but we could be more specific. Let us create a **JsonPlaceholderError** in a new file called **errors.js** that you put into `src/app`:

```js
import { CerebralError } from 'cerebral'

export class JsonPlaceholderError extends CerebralError {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = 'JsonPlaceholderError'
  }
}
```

We can now handle this error specifically in our module:

```js
import { Module } from 'cerebral'
import { jsonPlaceholder } from './providers'
import { loadUser, handleError } from './sequences'
import { JsonPlaceholderError } from './errors'

export default Module({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false
  },
  signals: {
    loadUser
  },
  catch: [[JsonPlaceholderError, handleError]],
  providers: {
    jsonPlaceholder
  }
})
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
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/proxy'

export const handleError = [
  set(state.error, props.error.message)
]

export const loadUser = [...]
```

Now let us throw an error when our provider runs:

```js
import { Provider } from 'cerebral'
import { JsonPlaceholderError } from './errors'

export const jsonPlaceholder = Provider({
  getUser(id) {
    throw new JsonPlaceholderError('Wuuut', 0)
  }
})
```

As you can see the debugger indicates when it catches an error and how it is handled. Note that by default Cerebral will not throw to the console when errors occur, but just give you a warning about it. You can force Cerebral to also throw to the console by passing in an option to the controller:

```js
import { Controller } from 'cerebral'
import app from './app'

let Devtools = null
if (process.env.NODE_ENV === 'development') {
  Devtools = require('cerebral/devtools').default
}

export default Controller(app, {
  ???
  devtools: Devtools({
    host: 'localhost:8585'
  })
})
```
