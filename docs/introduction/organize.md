# Organize

When starting with Cerebral, you might begin with all your code in a single file. As your application grows, organizing your code becomes essential for maintenance and scalability.

## The Evolution of a Cerebral App

Let's walk through how to transform a single-file app into a well-organized structure.

### Starting Point

Your initial app might look something like this:

```js
import App from 'cerebral'
import { state, props } from 'cerebral'
import { set } from 'cerebral/factories'
import Devtools from 'cerebral/devtools'

// Define actions
const getPosts = ({ api }) => api.getPosts().then((posts) => ({ posts }))
const getUser = ({ api, props }) =>
  api.getUser(props.id).then((user) => ({ user }))

// Define sequences
const openPostsPage = [
  set(state`isLoadingPosts`, true),
  getPosts,
  set(state`posts`, props`posts`),
  set(state`isLoadingPosts`, false)
]

const openUserModal = [
  set(state`userModal.show`, true),
  set(state`userModal.id`, props`id`),
  set(state`isLoadingUser`, true),
  getUser,
  set(state`users.${props`id`}`, props`user`),
  set(state`isLoadingUser`, false)
]

// Define API provider
const api = {
  getPosts() {
    return fetch('https://jsonplaceholder.typicode.com/posts').then(
      (response) => response.json()
    )
  },
  getUser(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(
      (response) => response.json()
    )
  }
}

// Define main module
const main = {
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
  },
  sequences: {
    openPostsPage,
    openUserModal
  },
  providers: {
    api
  }
}

// Create the app
const app = App(main, {
  devtools:
    process.env.NODE_ENV === 'production'
      ? null
      : Devtools({ host: 'localhost:8585' })
})

// Use the app
app.getSequence('openPostsPage')()
```

As your application grows, this approach becomes difficult to maintain. Let's break it down into separate files.

## First Step: Separate Files by Type

The first step in organizing your code is to separate it by type into different files.

### Main Module (src/main/index.js)

```js
import * as sequences from './sequences'
import * as providers from './providers'

export default {
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
  },
  sequences,
  providers
}
```

### Actions (src/main/actions.js)

```js
export const getPosts = ({ api }) => api.getPosts().then((posts) => ({ posts }))

export const getUser = ({ api, props }) =>
  api.getUser(props.id).then((user) => ({ user }))
```

### Sequences (src/main/sequences.js)

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'
import * as actions from './actions'

export const openPostsPage = [
  set(state`isLoadingPosts`, true),
  actions.getPosts,
  set(state`posts`, props`posts`),
  set(state`isLoadingPosts`, false)
]

export const openUserModal = [
  set(state`userModal.show`, true),
  set(state`userModal.id`, props`id`),
  set(state`isLoadingUser`, true),
  actions.getUser,
  set(state`users.${props`id`}`, props`user`),
  set(state`isLoadingUser`, false)
]
```

### Providers (src/main/providers.js)

```js
const API_URL = 'https://jsonplaceholder.typicode.com'

export const api = {
  getPosts() {
    return fetch(`${API_URL}/posts`).then((response) => response.json())
  },
  getUser(id) {
    return fetch(`${API_URL}/users/${id}`).then((response) => response.json())
  }
}
```

### App Entry Point (src/index.js)

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import main from './main'

const app = App(main, {
  devtools:
    process.env.NODE_ENV === 'production'
      ? null
      : Devtools({ host: 'localhost:8585' })
})

// Get a sequence directly from the app
const openPostsPage = app.getSequence('openPostsPage')

// Run it
openPostsPage()
```

## Second Step: Add Feature Modules

As your application grows further, you'll want to organize code by features or domains:

```js
src /
  main / // Root module
  modules / // Feature modules
  auth / // Authentication feature
  posts / // Posts feature
  users / // Users feature
  actions.js // Shared actions
sequences.js // Shared sequences
providers.js // Shared providers
index.js // Main module definition
index.js // App entry point
```

Each feature module can follow the same structure as the main module:

```js
src / main / modules / posts / actions.js // Post-specific actions
sequences.js // Post-specific sequences
computeds.js // Post-specific computed values
index.js // Module definition
```

### Feature Module Example (src/main/modules/posts/index.js)

```js
import * as sequences from './sequences'

export default {
  state: {
    items: [],
    currentId: null,
    isLoading: false
  },
  sequences
}
```

### Including Modules (src/main/index.js)

```js
import * as sequences from './sequences'
import * as providers from './providers'
import auth from './modules/auth'
import posts from './modules/posts'
import users from './modules/users'

export default {
  state: {
    title: 'My Project'
  },
  sequences,
  providers,
  modules: {
    auth,
    posts,
    users
  }
}
```

## Benefits of This Approach

Organizing your code this way provides several benefits:

1. **Maintainability**: Each file has a clear purpose
2. **Collaboration**: Team members can work on different modules
3. **Testability**: Easier to write focused tests for actions and sequences
4. **Scalability**: Structure supports growth of application complexity
5. **Reusability**: Actions and sequences can be shared between modules

For more advanced organization techniques and best practices as your application grows larger, see the [Structure guide](/docs/advanced/structure.html).
