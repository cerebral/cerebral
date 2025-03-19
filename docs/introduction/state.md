# State

Cerebral uses a single state tree to store all the state of your application. Even though you split up your state into modules, at the end of the day it will look like one big tree:

```js
{
  title: 'My Project',
  someOtherModule: {
    foo: 'bar'
  }
}
```

## State management principles

Cerebral's state management is built on several key principles:

1. **Simple data types**: Store only plain objects, arrays, strings, numbers, booleans, and a few special types like File and Blob
2. **Serializable state**: The entire state tree can be serialized to JSON (with a few exceptions like File objects)
3. **Path-based access**: All state is accessed via paths, making it easy to understand data relationships
4. **Controlled mutations**: State can only be changed through the store API, ensuring all changes are tracked

These principles make your application more predictable and easier to debug.

## Adding state to your app

Let's expand our application with more state to manage posts and users:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'

const app = App({
  state: {
    title: 'My Project',
    posts: [],
    users: {},
    userModal: {
      show: false,
      id: null
    },
    isLoadingPosts: false,
    isLoadingUser: false,
    error: null
  }
}, {...})
```

## Data modeling strategies

When modeling your state, you'll need to decide how to structure your data. There are two main approaches:

### Arrays vs Objects for collections

For our posts and users, we've chosen different storage approaches:

```js
{
  posts: [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 2 }
  ],
  users: {
    '1': { id: 1, name: 'User 1' },
    '2': { id: 2, name: 'User 2' }
  }
}
```

The decision depends on how you'll access the data:

- **Arrays** are best when you primarily need to iterate through items (like rendering a list of posts)
- **Objects with ID keys** are better for lookups by ID (like finding a user by ID)

For example, to display a user in our modal:

```js
// With object storage - O(1) constant time lookup
const user = users[userModal.id]

// With array storage - O(n) linear time search
const user = users.find((user) => user.id === userModal.id)
```

Objects also naturally prevent duplicate entries with the same ID, since object keys must be unique.

## Accessing state

In Cerebral, you access state using the `state` tag:

```js
import { state } from 'cerebral'

// In a component
connect({
  title: state`title`,
  posts: state`posts`
})

// In an action
function myAction({ get }) {
  const title = get(state`title`)
  const posts = get(state`posts`)
}
```

You can also use a cleaner object notation syntax if you configure the [babel-plugin-cerebral](/docs/api/proxy.html) in your project:

```js
import { state } from 'cerebral'

// In a component
connect({
  title: state.title,
  posts: state.posts
})

// In an action
function myAction({ get }) {
  const title = get(state.title)
  const posts = get(state.posts)
}
```

## Updating state

State can only be updated in actions using the store provider:

```js
function setTitle({ store }) {
  store.set(state`title`, 'New Title')
}

function addPost({ store, props }) {
  store.push(state`posts`, props.post)
}
```

We'll explore more about state operations in later sections.
