# cerebral-provider-firebase

## install
`npm install cerebral-provider-firebase@next --save --save-next`

## description
The Firebase provider is a Cerebral friendly wrapper around the Firebase client. By default the Firebase client is heavily event based, even just getting some value, handling authentication etc. This is useful in some types of apps, but Cerebral has a very straight forward way of thinking about side effects. You will find that a lot of the API exposed by the Firebase client is simplified!


## instantiate

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

**Important notes**

- The Cerebral firebase provider uses **dot** notation to keep consistency with Cerebral itself

- All factories supports template tags, allowing you to dynamically create paths and points to values

## set
Write data to this database location. This will overwrite any data at this location and all child locations. Passing **null** for the new value is equivalent to calling remove(); all data at this location or any child location will be deleted.

*action*
```javascript
function someAction({firebase, path}) {
  return firebase.set('foo.bar', 'baz')
    .then(path.success)
    .catch(path.error)
}
```

*factory*
```javascript
import {props} from 'cerebral/tags'
import {set} from 'cerebral-provider-firebase/operators'

export default [
  set('foo.bar', props`foo`), {
    success: [],
    error: []
  }
]
```

## update
As opposed to the set() method, update() can be use to selectively update only the referenced properties at the current location (instead of replacing all the child properties at the current location).

*action*
```javascript
function someAction({firebase, path}) {
  return firebase.update('some.path', {
    'foo': 'bar',
    'items.item1.isAwesome': true
  })
    .then(path.success)
    .catch(path.error)
}
```

*factory*
```javascript
import {props} from 'cerebral/tags'
import {update} from 'cerebral-provider-firebase/operators'

export default [
  update('some.path', {
    'foo.bar': props`bar`,
    'foo.baz': props`baz`
  }), {
    success: [],
    error: []
  }
]
```

## push
Generates a new child location using a unique key and returns its reference from the action. An example being `{key: "-KWKImT_t3SLmkJ4s3-w"}`.

*action*
```javascript
function someAction({firebase, path}) {
  return firebase.push('users', {
    name: 'Bob'
  })
    .then(path.success)
    .catch(path.error)
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {push} from 'cerebral-provider-firebase/operators'

export default [
  push('users', state`newUser`), {
    success: [],
    error: []
  }
]
```

## remove
Remove the data at this database location.

*action*
```javascript
function someAction({ firebase, path}) {
  return firebase.remove('foo.bar')
    .then(path.success)
    .catch(path.error)
}
```

*factory*
```javascript
import {props, string} from 'cerebral/tags'
import {remove} from 'cerebral-provider-firebase/operators'

export default [
  remove(string`users.${props`userKey`}`), {
    success: [],
    error: []
  }
]
```

## transaction
Atomically modifies the data at the provided location.

Unlike a normal set(), which just overwrites the data regardless of its previous value, transaction() is used to modify the existing value to a new value, ensuring there are no conflicts with other clients writing to the same location at the same time.

To accomplish this, you pass transaction() an update function which is used to transform the current value into a new value. If another client writes to the location before your new value is successfully written, your update function will be called again with the new current value, and the write will be retried. This will happen repeatedly until your write succeeds without conflict or you abort the transaction by not returning a value from your update function.

*action*
```javascript
function someAction({firebase, path}) {

  function transactionFunction(currentData){
    if (currentData === null) {
      return { foo: 'bar' }
    }

    return // Abort the transaction.
  }

  return firebase.transaction('some.transaction.path', transactionFunction)
    .then((result) => {
      if(result.committed){
        return path.success({result: result.value})
      } else {
        return path.abort()
      }
    })
    .catch(path.error)
}
```

*factory*
```javascript
import {transaction} from 'cerebral-provider-firebase/operators'

function transactionFunction(currentData){
  if (currentData === null) {
    return { foo: 'bar' }
  }

  return // Abort the transaction.
}

export default [
  transaction('foo.bar', transactionFunction), {
    success: [],
    error: []
  }
]
```

Note: Modifying data with set() will cancel any pending transactions at that location, so extreme care should be taken if mixing set() and transaction() to update the same data.

Note: When using transactions with Security and Firebase Rules in place, be aware that a client needs .read access in addition to .write access in order to perform a transaction. This is because the client-side nature of transactions requires the client to read the data in order to transactionally update it.

## value

*action*
```js
function someAction({ firebase, path }) {
  return firebase.value('someKey.foo')
    .then(path.success)
    .catch(path.error);
}
```
The result will be available as `{ key: 'foo', value: 'bar' }`. Or `{ error: 'error message'}`.

*factory*
```javascript
import {value} from 'cerebral-provider-firebase/operators'

export default [
  value('foo.bar'), {
    success: [],
    error: []
  }
]
```

## onValue

*action*
```js
function someAction({ firebase }) {
  firebase.onValue('someKey.foo', 'someModule.fooUpdated',  {
    payload: {}, // Merged with the payload passed on new data
  });
}
```
This will **NOT** immediately grab the value and trigger the signal passed, the first event is discarded for more predictable behaviour. To grab existing value, just use `value`.

To stop listening for updates to the value:
```js
function someAction({ firebase }) {
  firebase.off('someKey.foo', 'onValue', 'someModule.fooUpdated');
}
```

*factory*
```javascript
import {onValue} from 'cerebral-provider-firebase/operators'

export default [
  onValue('foo.bar', 'some.signal')
]
```

## onChildAdded

*action*
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

*factory*
```javascript
import {state} from 'cerebral/tags'
import {onChildAdded} from 'cerebral-provider-firebase/operators'

export default [
  onChildAdded('foo.bar', 'some.signal', {
    orderByChild: 'count',
    limitToFirst: state`config.limitToFirst`
  })
]
```

## onChildRemoved

*action*
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

*factory*
```javascript
import {onChildRemoved} from 'cerebral-provider-firebase/operators'

export default [
  onChildRemoved('foo.bar', 'some.signal', {
    // Same options as above
  })
]
```

## onChildChanged

*action*
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

*factory*
```javascript
import {onChildChanged} from 'cerebral-provider-firebase/operators'

export default [
  onChildChanged('foo.bar', 'some.signal', {
    // Same options as above
  })
]
```

## task
If you are using the [firebase-queue](https://github.com/firebase/firebase-queue) and need to create tasks, you can do that with:

*action*
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

*factory*
```javascript
import {state, props} from 'cerebral/tags'
import {task} from 'cerebral-provider-firebase/operators'

export default [
  task('some_task', {
    uid: state`user.uid`,
    data: props`data`
  }), {
    success: [],
    error: []
  }
]
```

## getUser
Will resolve to `{user: {}}` if user exists. If user was redirected from Facebook/Google etc. as part of first sign in, this method will handle the confirmed registration of the user.

*action*
```js
function someAction({ firebase, path }) {
  return firebase.getUser()
    .then(path.success)
    .catch(path.error);
}
```

*factory*
```javascript
import {getUser} from 'cerebral-provider-firebase/operators'

export default [
  getUser(), {
    success: [],
    error: []
  }
]
```

## signInAnonymously
This login will method will resolve to existing anonymous or create a new one for you. Resolves to `{user: {}}`.

*action*
```js
function someAction({ firebase, path }) {
  return firebase.signInAnonymously()
    .then(path.success)
    .catch(path.error);
}
```

*factory*
```javascript
import {signInAnonymously} from 'cerebral-provider-firebase/operators'

export default [
  signInAnonymously(), {
    success: [],
    error: []
  }
]
```

## createUserWithEmailAndPassword
Register a new user with email and password. Resolves to `{user: {}}`.

*action*
```js
function someAction({ firebase, path, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase.createUserWithEmailAndPassword(email, password)
    .then(path.success)
    .catch(path.error);
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {createUserWithEmailAndPassword} from 'cerebral-provider-firebase/operators'

export default [
  createUserWithEmailAndPassword(state`newUser.email`, state`newUser.password`), {
    success: [],
    error: []
  }
]
```

## signInWithEmailAndPassword
Sign in a user with email and password. Resolves to `{user: {}}`.

*action*
```js
function someAction({ firebase, path, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase.signInWithEmailAndPassword(email, password)
    .then(path.success)
    .catch(path.error);
}
```

*factory*
```javascript
import {props} from 'cerebral/tags'
import {signInWithEmailAndPassword} from 'cerebral-provider-firebase/operators'

export default [
  signInWithEmailAndPassword(props`email`, props`password`), {
    success: [],
    error: []
  }
]
```

## signInWith{PROVIDER}
Sign in a user with Facebook, Google or Github. Resolves to `{user: {}}`, or redirects.

*action*
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

*factory*
```javascript
import {state} from 'cerebral/tags'
import {signInWithFacebook} from 'cerebral-provider-firebase/operators'

export default [
  signInWithFacebook({
    redirect: state`useragent.media.small`
  }), {
    success: [],
    error: []
  }
]
```
Similar you can sign in with Google or GitHub.
Just use `signInWithGoogle` or `signInWithGithub` instead of `signInWithFacebook`.

## linkWithFacebook{PROVIDER}
Link an anonymous account with Facebook, Google or Github. Resolves to `{user: {}}`, or redirects.

*action*
```js
function someAction({ firebase, path, state }) {
  return firebase.linkWithFacebook({
    redirect: false, // Use popup or redirect. Redirect typically for mobile
    scopes: [] // Facebook scopes to access
  })
    .then(path.success)
    .catch(path.error);
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {linkWithFacebook} from 'cerebral-provider-firebase/operators'

export default [
  linkWithFacebook({
    redirect: state`useragent.media.small`
  }), {
    success: [],
    error: []
  }
]
```
Similar you can sign in with Google or GitHub.
Just use `linkWithGoogle` or `linkWithGithub` instead of `linkWithFacebook`.

## signOut
Sign out user. **getUser** will now not resolve a user anymore.

*action*
```js
function someAction({ firebase, path }) {
  return firebase.signOut()
    .then(path.success)
    .catch(path.error);
}
```

*factory*
```javascript
import {signOut} from 'cerebral-provider-firebase/operators'

export default [
  signOut(), {
    success: [],
    error: []
  }
]
```

## sendPasswordResetEmail

*action*
```js
function someAction({ firebase, path, state }) {
  return firebase.sendPasswordResetEmail(state.get('user.email'))
    .then(path.success)
    .catch(path.error);
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {sendPasswordResetEmail} from 'cerebral-provider-firebase/operators'

export default [
  sendPasswordResetEmail(state`user.email`), {
    success: [],
    error: []
  }
]
```

## setOnDisconnect
Sets a value when Firebase detects user has disconnected.

*action*
```js
function someAction({ firebase, state }) {
  firebase.setOnDisconnect(`activeUsers.${state.get('app.user.uid')}`, 'someValue')
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {setOnDisconnect} from 'cerebral-provider-firebase/operators'

export default [
  setOnDisconnect(string`activeUsers.${state`app.user.uid`}`, null)
]
```

## cancelOnDisconnect
Cancel setting a value when Firebase detects disconnect.

*action*
```js
function someAction({ firebase, state }) {
  firebase.cancelOnDisconnect()
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {cancelOnDisconnect} from 'cerebral-provider-firebase/operators'

export default [
  cancelOnDisconnect()
]
```

## put

Upload a new file at the given location. Please note that the file is **not** stored inside the realtime database but into Google Cloud Storage (please consult filrebase documentation). This means that you need to take care of storage security as well.

The options expect a progress field that can be either a signal (that will be called with `progress`, `totalBytes` and `bytesTransferred`) or a state path to directly set `progress` value.

Note that `put` expects a folder as first argument and will use the name of the provided file. If you want to control the filename, add this in the options. In this case, make sure to respect file type and extension...

On success, `props` contains an `url` and the `filename`.

```js
import {props, signal, state, string} from 'cerebral/tags'
import {put} from 'cerebral-provider-firebase/operators'

// we expect props.file to contain a file provided by
// a user in an <input type='file' />
export default [
  put(string`posts.all.${props`postId`}`, props`file`, {
    progress: signal`gallery.progress`
  }), {
    success: [
      set(state`posts.all.${props`postId`}.imageUrl`, props`url`),
      set(state`posts.all.${props`postId`}.imageName`, props`filename`),
    ],
    error: []
  }
]
```

## delete

Use `delete` to remove an uploaded file. Specify the containing folder and filename.

```js
import {props, state, string} from 'cerebral/tags'
import {put} from 'cerebral-provider-firebase/operators'

export default [
  firebase.delete(
    string`posts.all.${props`postId`}`,
    state`posts.all.${props`postId`}.imageName`
  ), {
    success: [],
    error: []
  }
]
```
