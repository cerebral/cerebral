# State

```marksy
<Youtube url="https://www.youtube.com/embed/OIKz6iASp1A" />
```

Cerebral uses a single state tree to store all the state of your application. Even though you split up your state into modules, at the end of the day it will look like one big tree:

```js
{
  title: 'My Project',
  someOtherModule: {
    foo: 'bar'
  }
}
```

You will normally store other objects, arrays, strings, booleans and numbers in it. Forcing you to think of your state in this simple form gives us benefits.

1.  The state of the application is exposed as simple values. There are no classes or other abstractions hiding the state of your application
2.  The state can be stored on the server, local storage and passed to the debugger. It is what we call **serializable** state
3.  All the state of your application can be inspected through one object
4.  All state is related to a path. There is no need to import and/or pass around model instances into other model instances to access state

Let us add some new state to the application to show of some more Cerebral. In our **main/index.js** file:

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
    isLoadingItems: false,
    isLoadingUser: false,
    error: null
  }  
}, {...})
```

We are going to load posts from [JSONPlaceholder](https://jsonplaceholder.typicode.com). We also want to be able to click a post to load information about the user who wrote it, in a modal. For this to work we need some state. All the state defined here is pretty straight forward, but why do we choose an array for the posts and an object for the users?

## Storing data

**Data** in this context means entities from the server that are unique, they have a unique *id*. Both posts and users are like this, but we still choose to store posts as arrays and users as an object. Choosing one or the other is as simple as asking yourself, "What am I going to do with the state?". In this application we are only going to map over the posts to display a list of posts, nothing more. Arrays are good for that. But users here are different. We want to get a hold of the user in question with an id, *userModal.id*. Objects are very good for this. Cause we can say:

```js
users[userModal.id]
```

No need to iterate through an array to find the user. Normally you will store data in objects, because you usually have the need for lookups. An object also ensures that there will never exist two entities with the same id, unlike in an array.