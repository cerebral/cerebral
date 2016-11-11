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
### Adding data

#### set
Write data to this database location.

This will overwrite any data at this location and all child locations.


Passing null for the new value is equivalent to calling remove(); all data at this location or any child location will be deleted.

```javascript
function someAction({ firebase, path}) {
  return firebase.set('foo',payload)
    .then(path.success)
    .catch(path.error);
}
```

#### update
The payload argument contains multiple property/value pairs that will be written to the database together. Each child property can either be a simple property (for example, "name"), or a relative path (for example, "name/first") from the current location to the data to update.

As opposed to the set() method, update() can be use to selectively update only the referenced properties at the current location (instead of replacing all the child properties at the current location).

A single update() will generate a single "value" event at the location where the update() was performed, regardless of how many children were modified.

Note that modifying data with update() will cancel any pending transactions at that location, so extreme care should be taken if mixing update() and transaction() to modify the same data.

Passing null to update() will remove the data at this location.

```javascript
function someAction({ firebase, path}) {
  return firebase.update('foo',payload)
    .then(path.success)
    .catch(path.error);
}
```

#### push
Generates a new child location using a unique key and returns its reference.

push returns the key of new item `{key: "-KWKImT_t3SLmkJ4s3-w"}`

This is the most common pattern for adding data to a collection of items.

The unique key generated by push() are ordered by the current time, so the resulting list of items will be chronologically sorted.

```javascript
function someAction({ firebase, path}) {
  return firebase.push('bar',payload)
    .then(path.success)
    .catch(path.error);
}
```

#### remove
Remove the data at this database location.

Any data at child locations will also be deleted.

Equivalent to passing null as a value to set() operation

```javascript
function someAction({ firebase, path}) {
  return firebase.remove(`foo.bar`)
    .then(path.success)
    .catch(path.error);
}
```

#### transaction
Returns a transaction object

```javascript
{
  committed:true //if transaction was successful,
  value: 'newValue' //if transaction was successful
}

{
  committed:false //if transaction was unsuccessful,
  value: 'existingValue' //if transaction was unsuccessful,
}
```

Atomically modifies the data at the provided location.

Unlike a normal set(), which just overwrites the data regardless of its previous value, transaction() is used to modify the existing value to a new value, ensuring there are no conflicts with other clients writing to the same location at the same time.

To accomplish this, you pass transaction() an update function which is used to transform the current value into a new value. If another client writes to the location before your new value is successfully written, your update function will be called again with the new current value, and the write will be retried. This will happen repeatedly until your write succeeds without conflict or you abort the transaction by not returning a value from your update function.

Note: Modifying data with set() will cancel any pending transactions at that location, so extreme care should be taken if mixing set() and transaction() to update the same data.

Note: When using transactions with Security and Firebase Rules in place, be aware that a client needs .read access in addition to .write access in order to perform a transaction. This is because the client-side nature of transactions requires the client to read the data in order to transactionally update it.

```javascript
function someAction({ firebase, path}) {

  function transactionFunction(currentData){
    if (currentData === null) {
      return { foo: 'bar' };
    } else {
      return; // Abort the transaction.
    }
  }

  return firebase.transaction('transactionPath',transactionFunction)
    .then((result) => {
      if(result.committed){
        return path.success({result: result.value})
      } else {
        return path.fail({result: result.value})
      }
    })
    .catch(path.error);
}
```
