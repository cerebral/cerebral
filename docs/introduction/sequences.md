# Sequences

Application development is about handling events to run side effects and produce changes to the state. This event can be anything from a user interaction or some other internal event in the application.

We need two pieces of logic for our application. **openPostsPage** and **openUserModal**. Let us look at how you might think this logic is commonly implemented:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'

const API_URL = 'https://jsonplaceholder.typicode.com'

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
  },
  methods: {
    openPostsPage() {
      this.state.isLoadingPosts = true
      this.providers.getPosts()
        .then((posts) => {
          this.state.posts = posts
          this.state.isLoadingPosts = false
        })
    }
    openUserModal(id) {
      this.state.isLoadingUser = true
      this.providers.getUser(id)
        .then((user) => {
          this.state.users[id] = user
          this.state.currentUserId = id
          this.state.isLoadingUser = false
        })
    }
  },
  providers: {...}  
}, {...})
```

This is an **imperative** approach to managing application logic, using methods. In Cerebral we do not use an imperative approach, but a functional one. That means instead of methods we use **sequences**. Let us review what we want to happen before we dive into it:

1.  Set that we are loading the posts
2.  Go grab the posts
3.  Add the posts
4.  Unset that we are loading the posts

We can mock out this **sequence** in our main module:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'

const API_URL = 'https://jsonplaceholder.typicode.com'

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
  },
  sequences: {
    openPostsPage: [
      setLoadingPosts,
      getPosts,
      setPosts,
      unsetLoadingPosts
    ]
  },
  providers: {...}  
}, {...})
```

As you can see we can just write out exactly what we want to happen. This allows us to reason about **what** we want our application to do before we think about **how** to do it.

```marksy
<Info>
When a sequence triggers you can pass in **props**. These props can be accessed by any function
in the sequence. In this example the props would contain the id of the user we want to fetch.
</Info>
```

We are now going to do the actual implementation:

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'

const API_URL = 'https://jsonplaceholder.typicode.com'

const setLoadingPosts = ({ store }) =>
  store.set('isLoadingPosts', true)

const getPosts = ({ api }) =>
  api.getPosts().then(posts => ({ posts }))

const setPosts = ({ store, props }) =>
  store.set('posts', props.posts)

const unsetLoadingPosts = ({ store }) =>
  store.set('isLoadingPosts', false)

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
  },
  sequences: {
    openPostsPage: [
      setLoadingPosts,
      getPosts,
      setPosts,
      unsetLoadingPosts
    ]
  },
  providers: {...}  
}, {...})
```

## Actions

As you can see every function run in the sequence has access to **store**, **props** and our own **api** is available as well. We call these functions **actions** and Cerebral builds a context for them when they run. This context is passed in as the only argument. This context is where the store API allows you to do different changes on the state of the application. The props holds values passed into the sequence and populated through the execution.

When **api.getPosts** runs we put the returned posts on an object. This object is merged into the **props** of the sequence, as visualized here:

```js
[
  setLoadingPosts, // {}
  getPosts, // {}
  setPosts, // { posts }
  unsetLoadingPosts // { posts }
]
```

Let us fire up the sequence and we can rather let the debugger do this visualization for us. In the `/src/index.js` add the following:

```js
import App, { sequences } from 'cerebral'
import Devtools from 'cerebral/devtools'

const API_URL = 'https://jsonplaceholder.typicode.com'

const setLoadingPosts = ({ store }) =>
  store.set('isLoadingPosts', true)

const getPosts = ({ api }) =>
  api.getPosts().then(posts => ({ posts }))

const setPosts = ({ store, props }) =>
  store.set('posts', props.posts)

const unsetLoadingPosts = ({ store }) =>
  store.set('isLoadingPosts', false)

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
  },
  sequences: {
    openPostsPage: [
      setLoadingPosts,
      getPosts,
      setPosts,
      unsetLoadingPosts
    ]
  },
  providers: {...}  
}, {...})

const openPostsPage = app.getSequence('openPostsPage')

openPostsPage()
```

When you refresh the application now you should see the debugger show you that the *openPostsPage* sequence has triggered. Play around with the checkboxes at the top of the execution window in the debugger to adjust the level of detail.

## Factories

But we can actually refactor our *openPostsPage* sequence a bit. A concept in functional programming called *factories* allows you to create a function by calling a function. What we want to create are functions that changes the state of the application. Luckily for us Cerebral ships with several factories that allows you to express state changes and other things directly in your sequences.

Let us refactor the code and also add the sequence for loading a user. What to take notice of here is that we are using the **state** and **props** [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). These tags can be used to tell the factories what you are targeting, at what path:

```js
import App, { state, props } from 'cerebral'
import Devtools from 'cerebral/devtools'
import { set } from 'cerebral/factories'

const API_URL = 'https://jsonplaceholder.typicode.com'

const getPosts = ({ api }) =>
  api.getPosts().then(posts => ({ posts }))

const getUser = ({ api, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

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
  },
  sequences: {
    openPostsPage: [
      set(state`isLoadingPosts`, true),
      getPosts,
      set(state`posts`, props`posts`),
      set(state`isLoadingPosts`, false)
    ],
    openUserModal: [
      set(state`userModal.id`, props`id`),
      set(state`userModal.show`, true),
      set(state`isLoadingUser`, true),
      getUser,
      set(state`users.${props`id`}`, props`user`),
      set(state`isLoadingUser`, false)
    ]
  },
  providers: {...}  
}, {...})

const openPostsPage = app.getSequence('openPostsPage')

openPostsPage()
```

We now just made several actions obsolete. There are other factories for changin state and also managing the flow of execution.
