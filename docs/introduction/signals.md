# Signals

```marksy
<Youtube url="https://www.youtube.com/embed/o2ULoHp22BE" />
```

Any event in your application should trigger a signal. An event is everything from a button click to a url change. It can be a user interaction or some other internal event in the application. We are now going to define a signal that we will trigger manually. This signal should receive an id of a user, go grab that user and store it as the current user in your application.

A signal is built up by something we call **sequences**. A sequence is basically just a list of **actions** to perform. An **action** is what makes things happen in Cerebral. It is just a function, but a function that has the ability access astate and providers.

When you build Cerebral application you typically write out the sequences first, then you implement the actions. Let us try that approach now. What we want to happen is:

1.  Set that we are loading a user
2.  Go grab the user
3.  Add the user
4.  Set current user
5.  Unset that we are loading a user

Let us create a **sequences.js** file in `src/app` and export a sequence:

```js
import * as actions from './actions'

export const loadUser = [
  actions.setLoadingUser,
  actions.getUser,
  actions.addUser,
  actions.setCurrentUser,
  actions.unsetLoadingUser
]
```

As you can see we can just write out exactly what we want to happen. This allows us to reason about **what** we want our application to do before we think about **how** to do it.

Let us create the **actions.js** file in `src/app` and look at how we implement the actions.

```js
export const setLoadingUser = ({ state }) => state.set('isLoadingUser', true)

export const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id)

export const addUser = ({ state, props }) =>
  state.set(`users.${props.id}`, props.user)

export const setCurrentUser = ({ state, props }) =>
  state.set('currentUserId', props.id)

export const unsetLoadingUser = ({ state }) => state.set('isLoadingUser', false)
```

As you can see every action has access to **state**, **props** and **jsonPlaceholder**. The state API allows you to do different mutations, here only showing _set_, give it a path and a value. The props holds values passed into and populated through the signal execution. When _jsonPlaceholder.getUser_ runs it will return an object with the user which will extend the props to:

```js
{
  id: 1,
  user: {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    ...
  }
}
```

And now this is available to the next action in line. Let us visualize this:

```js
import * as actions from './actions'

export const loadUser = [
  actions.setLoadingUser, // { id }
  actions.getUser, // { id }
  actions.addUser, // { id, user }
  actions.setCurrentUser, // { id, user }
  actions.unsetLoadingUser // { id, user }
]
```

Let us fire up the signal and we can rather let the debugger do this visualization for us. First we have to actually define the signal in our `src/app/index.js` file:

```js
import { Module } from 'cerebral'
import { jsonPlaceholder } from './providers'
import { loadUser } from './sequences'

export default Module({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  signals: {
    loadUser
  },
  providers: {
    jsonPlaceholder
  }
})
```

Then in `/src` create a file called **index.js** and add the following:

```js
import controller from './controller'

const loadUser = controller.getSignal('loadUser')
loadUser({
  id: 1
})
```

When you refresh the application now you should see the debugger show you that the _loadUser_ signal has triggered. Play around with the checkboxes at the top of the execution window in the debugger to adjust the level of detail.

## Operators and tags

But we can actually refactor our _loadUser_ signal a bit. We can take advantage of something called **operators** and **tags** to express state changes directly in the sequence. In the **sequences.js** file do:

```js
import * as actions from './actions'
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/tags'

export const loadUser = [
  set(state`isLoadingUser`, true),
  actions.getUser,
  set(state`users.${props`id`}`, props`user`),
  set(state`currentUserId`, props`id`),
  set(state`isLoadingUser`, false)
]
```

We now just made 4 actions obsolete. By using the **set** operator and the tags, which are [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), we are able to be more efficient and keep a good level of declarativeness. But we can actually do better. Recently Cerebral released proxies. Take another look:

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

Proxies allows us to improve the declarativeness a little bit, but more importantly they open up for typing using [TypeScript](https://www.typescriptlang.org/). The proxies does require an additional package though, called [babel-plugin-cerebral](). Let us try it.

Install the plugin by: `npm install babel-plugin-cerebral`. Then you need to add a new file to your project root (not `/src`, but `/`). Name the file **.babelrc** and put:

```js
{
  "plugins": ["cerebral"]
}
```

You will need to restart the Parcel development process to make this take effect. Hit `CMD + C` in your terminal and run `npm start` again.

You can choose to use the traditional template literal tags if you want to, but the documentation and guides will always use the proxies.

## Paths

Our _actions.getUser_ might fail. The server might be unavailable for example. One way to solve this is to use conditional logic in the sequence. Let us first express a conditional in the sequence of **success** and **error**:

```js
import * as actions from './actions'
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/proxy'

export const loadUser = [
  set(state.isLoadingUser, true),
  actions.getUser,
  {
    success: [],
    error: []
  },
  set(state.users[props.id], props.user),
  set(state.currentUserId, props.id),
  set(state.isLoadingUser, false)
]
```

Objects in sequences are treated as conditional and it is the action in front of it, _actions.getUser_ in this case, that chooses what path of execution to take. Since we only want to set the user on a success, let us move them up there:

```js
import * as actions from './actions'
import { set } from 'cerebral/operators'
import { state, props } from 'cerebral/proxy'

export const loadUser = [
  set(state.isLoadingUser, true),
  actions.getUser,
  {
    success: [
      set(state.users[props.id], props.user),
      set(state.currentUserId, props.id)
    ],
    error: [set(state.error, props.error.message)]
  },
  set(state.isLoadingUser, false)
]
```

To actually handle the conditional execution we need to look back into our _getUser_ action located in **actions.js**:

```js
export const getUser = ({ jsonPlaceholder, props, path }) =>
  jsonPlaceholder
    .getUser(props.id)
    .then((result) => path.success(result))
    .catch((error) => path.error({ error }))
```

The **result** here is the object with the user and we use it as an argument when calling the success path. Note here that calling a path returns the path, meaning that you can not just call a path, it needs to be returned from the function/promise. When we catch an **error** we want to return an object with the error, which will be merged into the props of the signal.

Note that in this case we just chose to use **success** and **error** as paths here, but it could have been anything. You could even create paths for http error codes if you wanted to, specifically handling 404 for a user not found for example.
