# cerebral-provider-firebase
Firebase provider for Cerebral

## Install

`npm install cerebral-provider-firebase --save`

## Setup

```javascript
import {Controller} from 'cerebral'
import FirebaseProvider from 'cerebral-provider-firebase'

const controller = Controller({
  providers: [
    FirebaseProvider({
      config: {
        apiKey: '{apiKey}',
        authDomain: '{authDomain}',
        databaseURL: '{databaseURL}',
        storageBucket: '{storageBucket}'
      },
      // When using tasks and firebase queue you can prefix
      // the specs triggered. This is useful in development
      // when multiple developers are working on the
      // same instance
      specPrefix: 'CJ'
    })
  ]
})
```

### Retrieve data
The Cerebral firebase provider uses **dot** notation to keep consistency with Cerebral itself.

#### Value
```js
function someAction({ firebase, path }) {
  return firebase.value('someKey.foo')
    .then(path.success)
    .catch(path.error);
}
```
The result will be available as `{ key: 'foo', value: 'bar' }`. Or `{ error: 'error message'}`.

### Retrieve data with updates
When you also want to know when your queried data updates you have the following methods:

#### onValue
```js
function someAction({ firebase }) {
  firebase.onValue('someKey.foo', 'someModule.fooUpdated');
}
```
This will immediately grab the value and trigger the signal passed. Any other updates to the value will trigger the same signal.

To stop listening for updates to the value:
```js
function someAction({ firebase }) {
  firebase.off('someKey.foo', 'onValue', 'someModule.fooUpdated');
}
```

#### onChildAdded
```js
function someAction({ firebase }) {
  firebase.onChildAdded('posts', 'posts.postAdded', {
    payload: {}, // Merged with the payload passed on new data
    limitToFirst: 5, // Read Firebase docs
    limitToLast: 5, // Read Firebase docs
    startAt: 5, // Read Firebase docs
    endAt: 5, // Read Firebase docs
    equalTo: 5, // Read Firebase docs
    orderByChild: 'count', // Read Firebase docs
    orderByKey: true, // Read Firebase docs
    orderByValue: true // Read Firebase docs
  });
}
```
This will immediately grab and trigger the signal `posts.postAdded` for every post grabbed. Note this is just registering a listener, not returning a value from the action. The signal is triggered with the payload: `{ key: 'someKey', value: {} }`.

To stop listening for updates to the posts:
```js
function someAction({ firebase }) {
  firebase.off('posts', 'onChildAdded', 'posts.postAdded');
}
```

#### onChildRemoved
```js
function someAction({ firebase }) {
  firebase.onChildRemoved('posts', 'posts.postRemoved', {
    // Same options as above
  });
}
```
This will trigger the signal `posts.postRemoved` whenever a post is removed from the selection. The signal is triggered with the payload: `{ key: 'someKey' }`.

To stop listening:
```js
function someAction({ firebase }) {
  firebase.off('posts', 'onChildRemoved', 'posts.postRemoved');
}
```

#### onChildChanged
```js
function someAction({ firebase }) {
  firebase.onChildChanged('posts', 'posts.postChanged', {
    // Same options as above
  });
}
```
This will trigger the signal `posts.postChanged` whenever a post is changed in the selection. The signal is triggered with the payload: `{ key: 'someKey', value: {} }`.

To stop listening:
```js
function someAction({ firebase }) {
  firebase.off('posts', 'onChildChanged', 'posts.postChanged');
}
```

### Tasks
If you are using the [firebase-queue](https://github.com/firebase/firebase-queue) and need to create tasks, you can do that with:

```js
function someAction({ firebase, path, state }) {
  return firebase.task('create_post', {
    uid: state.get('app.user.uid'),
    text: state.get('posts.newPostText')
  })
    .then(path.success)
    .catch(path.error);
}
```

This will add a task at `queue/tasks`. There is no output from a resolved task, it just resolves when the action has been processed.

### Authentication

#### Get user
Will resolve to `{user: {}}` if user exists. If user was redirected from Facebook/Google etc. as part of first sign in, this method will handle the confirmed registration of the user.

```js
function someAction({ firebase, path }) {
  return firebase.getUser()
    .then(path.success)
    .catch(path.error);
}
```

#### Anonymous login
This login will method will resolve to existing anonymous or create a new one for you. Resolves to `{user: {}}`.

```js
function someAction({ firebase, path }) {
  return firebase.signInAnonymously()
    .then(path.success)
    .catch(path.error);
}
```

#### Create user with email and password
Register a new user with email and password. Resolves to `{user: {}}`.

```js
function someAction({ firebase, path, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase.createUserWithEmailAndPassword(email, password)
    .then(path.success)
    .catch(path.error);
}
```

#### Sign in user with email and password
Sign in a user with email and password. Resolves to `{user: {}}`.

```js
function someAction({ firebase, path, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase.signInWithEmailAndPassword(email, password)
    .then(path.success)
    .catch(path.error);
}
```

#### Sign in with Facebook
Sign in a user with Facebook. Resolves to `{user: {}}`, or redirects.

```js
function someAction({ firebase, path, state }) {
  return firebase.signInWithFacebook({
    redirect: false, // Use popup or redirect. Redirect typically for mobile
    scopes: [] // Facebook scopes to access
  })
    .then(path.success)
    .catch(path.error);
}
```

#### Sign out
Sign out user. **getUser** will now not resolve a user anymore.

```js
function someAction({ firebase, path }) {
  return firebase.signOut()
    .then(path.success)
    .catch(path.error);
}
```

#### Send reset password email

```js
function someAction({ firebase, path, state }) {
  return firebase.sendPasswordResetEmail(state.get('user.email'))
    .then(path.success)
    .catch(path.error);
}
```

### Action factories

#### signInAnonymously

```javascript
import {signInAnonymously} from 'cerebral-provider-firebase'

export default [
  signInAnonymously(), {
    success: [],
    error: []
  }
]
```

#### getUser

```javascript
import {getUser} from 'cerebral-provider-firebase'

export default [
  getUser(), {
    success: [],
    error: []
  }
]
```

#### signOut

```javascript
import {signOut} from 'cerebral-provider-firebase'

export default [
  signOut(), {
    success: [],
    error: []
  }
]
```
