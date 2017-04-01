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

## error

### FirebaseProviderError (base)
```js
import {FirebaseProviderError} from 'cerebral-provider-firebase'

// Error structure
{
  name: 'HttpProviderError',
  message: 'Some firebase error message'
  stack: '...'  
}
```

### FirebaseProviderAuthenticationError
```js
import {FirebaseProviderAuthenticationError} from 'cerebral-provider-firebase'

// Error structure
{
  name: 'HttpProviderError',
  message: 'Some firebase error message'
  code: 10 // firebase auth error code
  stack: '...'  
}
```

## set
Write data to this database location. This will overwrite any data at this location and all child locations. Passing **null** for the new value is equivalent to calling remove(); all data at this location or any child location will be deleted.

*action*
```javascript
function someAction({firebase}) {
  return firebase.set('foo.bar', 'baz')
}
```

*factory*
```javascript
import {props} from 'cerebral/tags'
import {set} from 'cerebral-provider-firebase/operators'

export default [
  set('foo.bar', props`foo`),

  // Alternatively with explicit paths
  set('foo.bar', props`foo`), {
    success: [],
    error: []
  }
]
```

*output*
No output

## update
As opposed to the set() method, update() can be use to selectively update only the referenced properties at the current location (instead of replacing all the child properties at the current location).

*action*
```javascript
function someAction({firebase}) {
  return firebase.update('some.path', {
    'foo': 'bar',
    'items.item1.isAwesome': true
  })
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
  }),

  // Alternatively with explicit paths
  update('some.path', {
    'foo.bar': props`bar`,
    'foo.baz': props`baz`
  }), {
    success: [],
    error: []
  }
]
```

*output*
No output

## push
Generates a new child location using a unique key and returns its reference from the action. An example being `{key: "-KWKImT_t3SLmkJ4s3-w"}`.

*action*
```javascript
function someAction({firebase}) {
  return firebase.push('users', {
    name: 'Bob'
  })
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {push} from 'cerebral-provider-firebase/operators'

export default [
  push('users', state`newUser`),

  // Alternatively with explicit paths
  push('users', state`newUser`), {
    success: [],
    error: []
  }
]
```

*output*
```javascript
{key: 'theAddedKey'}
```

## remove
Remove the data at this database location.

*action*
```javascript
function someAction({ firebase}) {
  return firebase.remove('foo.bar')
}
```

*factory*
```javascript
import {props, string} from 'cerebral/tags'
import {remove} from 'cerebral-provider-firebase/operators'

export default [
  remove(string`users.${props`userKey`}`),

  // Alternatively with explicit paths
  remove(string`users.${props`userKey`}`), {
    success: [],
    error: []
  }
]
```

*output*
No output

## transaction
Atomically modifies the data at the provided location.

Unlike a normal set(), which just overwrites the data regardless of its previous value, transaction() is used to modify the existing value to a new value, ensuring there are no conflicts with other clients writing to the same location at the same time.

To accomplish this, you pass transaction() an update function which is used to transform the current value into a new value. If another client writes to the location before your new value is successfully written, your update function will be called again with the new current value, and the write will be retried. This will happen repeatedly until your write succeeds without conflict or you abort the transaction by not returning a value from your update function.

*action*
```javascript
function someAction({firebase}) {

  function transactionFunction(currentData){
    if (currentData === null) {
      return { foo: 'bar' }
    }

    return // Abort the transaction.
  }

  return firebase.transaction('some.transaction.path', transactionFunction)
    .then((result) => {
      if(result.committed){
        return {result: result.value}
      } else {
        throw new Error('Transaction failed')
      }
    })
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
  transaction('foo.bar', transactionFunction),

  // Alternatively with explicit paths
  transaction('foo.bar', transactionFunction), {
    success: [],
    error: []
  }
]
```

*output*
```javascript
{committed: true, value: 'new value'}
```

Note: Modifying data with set() will cancel any pending transactions at that location, so extreme care should be taken if mixing set() and transaction() to update the same data.

Note: When using transactions with Security and Firebase Rules in place, be aware that a client needs .read access in addition to .write access in order to perform a transaction. This is because the client-side nature of transactions requires the client to read the data in order to transactionally update it.

## value

*action*
```js
function someAction({ firebase }) {
  return firebase.value('someKey.foo')
}
```

*factory*
```javascript
import {value} from 'cerebral-provider-firebase/operators'

export default [
  value('foo.bar'),

  // Alternatively with explicit paths
  value('foo.bar'), {
    success: [],
    error: []
  }
]
```

*output*
```javascript
{key: 'keyYouLookedUpValueOn', value: 'the value'}
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
function someAction({ firebase, state }) {
  return firebase.task('create_post', {
    uid: state.get('app.user.uid'),
    text: state.get('posts.newPostText')
  })
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
  }),

  // Alternatively with explicit paths
  task('some_task', {
    uid: state`user.uid`,
    data: props`data`
  }), {
    success: [],
    error: []
  }
]
```

*output*
No output

## getUser
Will resolve to `{user: {}}` if user exists. If user was redirected from Facebook/Google etc. as part of first sign in, this method will handle the confirmed registration of the user.

*action*
```js
function someAction({ firebase }) {
  return firebase.getUser()
}
```

*factory*
```javascript
import {getUser} from 'cerebral-provider-firebase/operators'

export default [
  getUser(),

  // Alternatively with explicit paths
  getUser(), {
    success: [],
    error: []
  }
]
```

*output*
```javascript
{user: {}}
```

## signInAnonymously
This login will method will resolve to existing anonymous or create a new one for you.

*action*
```js
function someAction({ firebase }) {
  return firebase.signInAnonymously()
}
```

*factory*
```javascript
import {signInAnonymously} from 'cerebral-provider-firebase/operators'

export default [
  signInAnonymously(),

  // Alternatively with explicit paths
  signInAnonymously(), {
    success: [],
    error: []
  }
]
```

*output*
```javascript
{user: {}}
```

## createUserWithEmailAndPassword
Register a new user with email and password.

*action*
```js
function someAction({ firebase, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase.createUserWithEmailAndPassword(email, password)
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {createUserWithEmailAndPassword} from 'cerebral-provider-firebase/operators'

export default [
  createUserWithEmailAndPassword(state`newUser.email`, state`newUser.password`),

  // Alternatively with explicit paths
  createUserWithEmailAndPassword(state`newUser.email`, state`newUser.password`), {
    success: [],
    error: []
  }
]
```

*output*
```javascript
{user: {}}
```

## signInWithEmailAndPassword
Sign in a user with email and password.

*action*
```js
function someAction({ firebase, path, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase.signInWithEmailAndPassword(email, password)
}
```

*factory*
```javascript
import {props} from 'cerebral/tags'
import {signInWithEmailAndPassword} from 'cerebral-provider-firebase/operators'

export default [
  signInWithEmailAndPassword(props`email`, props`password`),

  // Alternatively with explicit paths
  signInWithEmailAndPassword(props`email`, props`password`), {
    success: [],
    error: []
  }
]
```

*output*
```javascript
{user: {}}
```

## signInWith{PROVIDER}
Sign in a user with Facebook, Google or Github.

*action*
```js
function someAction({ firebase, state }) {
  return firebase.signInWithFacebook({
    redirect: false, // Use popup or redirect. Redirect typically for mobile
    scopes: [] // Facebook scopes to access
  })
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {signInWithFacebook} from 'cerebral-provider-firebase/operators'

export default [
  signInWithFacebook({
    redirect: state`useragent.media.small`
  }),

  // Alternatively with explicit paths
  signInWithFacebook({
    redirect: state`useragent.media.small`
  }), {
    success: [],
    error: []
  }
]
```

*output*
Either this will be a redirect or it outputs:

```javascript
{user: {}}
```

Similar you can sign in with Google or GitHub.
Just use `signInWithGoogle` or `signInWithGithub` instead of `signInWithFacebook`.

## linkWithFacebook{PROVIDER}
Link an anonymous account with Facebook, Google or Github.

*action*
```js
function someAction({ firebase, state }) {
  return firebase.linkWithFacebook({
    redirect: false, // Use popup or redirect. Redirect typically for mobile
    scopes: [] // Facebook scopes to access
  })
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {linkWithFacebook} from 'cerebral-provider-firebase/operators'

export default [
  linkWithFacebook({
    redirect: state`useragent.media.small`
  }),

  // Alternatively with explicit paths
  linkWithFacebook({
    redirect: state`useragent.media.small`
  }), {
    success: [],
    error: []
  }
]
```

*output*
Either this will be a redirect or it outputs:

```javascript
{user: {}}
```

Similar you can sign in with Google or GitHub.
Just use `linkWithGoogle` or `linkWithGithub` instead of `linkWithFacebook`.

## signOut
Sign out user. **getUser** will now not resolve a user anymore.

*action*
```js
function someAction({ firebase }) {
  return firebase.signOut()
}
```

*factory*
```javascript
import {signOut} from 'cerebral-provider-firebase/operators'

export default [
  signOut(),

  // Alternatively with explicit paths
  signOut(), {
    success: [],
    error: []
  }
]
```

*output*
No output

## sendPasswordResetEmail

*action*
```js
function someAction({ firebase, state }) {
  return firebase.sendPasswordResetEmail(state.get('user.email'))
}
```

*factory*
```javascript
import {state} from 'cerebral/tags'
import {sendPasswordResetEmail} from 'cerebral-provider-firebase/operators'

export default [
  sendPasswordResetEmail(state`user.email`),

  // Alternatively with explicit paths
  sendPasswordResetEmail(state`user.email`), {
    success: [],
    error: []
  }
]
```

*output*
No output

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

*output*
No output

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

*output*
No output

## put

Upload a new file at the given location. Please note that the file is **not** stored inside the realtime database but into Google Cloud Storage (please consult filrebase documentation). This means that you need to take care of storage security as well.

Note that `put` expects a folder as first argument and will use the name of the provided file. If you want to control the filename, add this in the options. In this case, make sure to respect file type and extension...

*action*
```js
function someAction({ firebase, props }) {
  return firebase.put('folderName', props.file, {
    progress({progress, bytesTransferred, totalBytes, state}) {
      /* do whatever */
    },
    // Override name, make sure you set same extension
    filename: 'customName.png'
  })
}
```

*factory*
```js
import {props, signal, string, state} from 'cerebral/tags'
import {put} from 'cerebral-provider-firebase/operators'

// we expect props.file to contain a file provided by
// a user in an <input type='file' />
export default [
  put(string`posts.all.${props`postId`}`, props`file`, {
    // Trigger a signal which receives payload
    progress: signal`gallery.progress`
    // Set progress on a state value
    progress: state`gallery.progress`
  }),

  // Alternatively with explicit paths
  put(string`posts.all.${props`postId`}`, props`file`, {
    progress: signal`gallery.progress`
    progress: state`gallery.progress`
  }), {
    success: [],
    error: []
  }
]
```

*output*
```js
{url: 'urlToFile', filename: 'nameOfFile'}
```

## delete

Use `delete` to remove an uploaded file. Specify the containing folder and filename.

*action*
```js
function someAction({ firebase, props }) {
  return firebase.delete('folderName', props.fileName)
}
```

*factory*
```js
import {props, state, string} from 'cerebral/tags'
import {delete as firebaseDelete} from 'cerebral-provider-firebase/operators'

export default [
  firebaseDelete(
    string`posts.all.${props`postId`}`,
    state`posts.all.${props`postId`}.imageName`
  ),

  // Alternatively with explicit paths
  firebaseDelete(
    string`posts.all.${props`postId`}`,
    state`posts.all.${props`postId`}.imageName`
  ), {
    success: [],
    error: []
  }
]
```

*output*
No output
