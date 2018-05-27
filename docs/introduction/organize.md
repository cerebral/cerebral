# Organize

Our file is starting to get a bit verbose. Let us look into how you typically organize a Cerebral application.

## Create a main module

We will first move the logic for defining the module into its own file under `src/main/index.js`:

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

## Create an actions file

Our actions should be contained in its own file at `src/main/actions.js`:

```js
import { state } from 'cerebral/proxy'

export const getPosts =  ({ api }) =>
  api.getPosts().then(posts => ({ posts }))

export const getUser = ({ api, props }) =>
  api.getUser(props.id).then(user => ({ user }))
```

## Create a sequences file

The same for sequences at `src/main/sequences.js`:

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'
import * as actions from './actions'

export const openPostsPage =  [
  set(state.isLoadingPosts, true),
  actions.getPosts,
  set(state.posts, props.posts),
  set(state.isLoadingPosts, false)
]

export const openUserModal = [
  set(state.userModal.show, true),
  set(state.userModal.id, props.id),
  set(state.isLoadingUser, true),
  actions.getUser,
  set(state.users[props.id], props.user),
  set(state.isLoadingUser, false),
]
```

## Create a provider file

Jup, that's right! `src/main/providers.js`:

```js
const API_URL = 'https://jsonplaceholder.typicode.com'

export const api = {
  getPosts() {
    return fetch(`${API_URL}/posts`)
      .then(response => response.toJSON())
  },
  getUser(id) {
    return fetch(`${API_URL}/users/${id}`)
      .then(response => response.toJSON())
  }
}
```

## We are left with

In our `src/index.js` file we are now left with:

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import main from './main'

const app = App(main, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})

const openPostsPage = app.get(sequences.openPostsPage)

openPostsPage()
```

Now this looks a lot cleaner and scalable. By adding a `modules` directory to `src/main` you can add more modules with domain specific names like **admin** or **posts**. These modules are added to the main module.