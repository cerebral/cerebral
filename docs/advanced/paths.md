# Paths

Our *getUser* action might fail. The server might be unavailable for example. One way to solve this is to use conditional logic in the sequence. Let us first express a conditional in the sequence of **success** and **error** and refactor a bit:

```js
import { state } from 'cerebral/proxy'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'

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
      set(state.isLoadingUser, true),
      getUser,
      {
        success: [
          set(state.users[props.id], props.user),
          set(state.currentUserId, props.id),
        ],
        error: set(state.error, props.error.message)
      }
      set(state.isLoadingUser, false)
    ]
  },
  providers: {...}
}
```

Objects in sequences are treated as conditional execution and it is the action in front of it, *getUser* in this case, that chooses what path of execution to take.


```marksy
<Info>
In this case we just chose to use **success** and **error** as paths here, but it could have been anything. You could even create paths for http error codes if you wanted to, specifically handling 404 for a user not found for example.
</Info>
```

To actually handle the conditional execution we need to look back into our *getUser* action:

```js
import { state } from 'cerebral/proxy'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'

const getUser = ({ jsonPlaceholder, props, path }) =>
  jsonPlaceholder
    .getUser(props.id)
    .then((user) => path.success({ user }))
    .catch((error) => path.error({ error }))

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
      set(state.isLoadingUser, true),
      getUser,
      {
        success: [
          set(state.users[props.id], props.user),
          set(state.currentUserId, props.id),
        ],
        error: set(state.error, props.error.message)
      }
      set(state.isLoadingUser, false)
    ]
  },
  providers: {...}
}
```

We pass our user as a payload to the **success**. When we catch an **error** we pass the error instead.

```marksy
<Warning>
When we call a path we return its result from the action. That means if you want an action to run down a path you have to call the path to execute and return its value. Just calling the path does nothing. The arrow functions used here implicity returns the path.
</Warning>
```
