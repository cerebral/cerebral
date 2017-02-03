# Storing server data

Your application usually needs to talk to a backend, grab some data and show it to the users. There are thousands of different types of backends and thousands of ways to structure the data. Discussions on how to store this data in the client, caching, optimistic updates, naming properties and endpoints are endless. Cerebral can only show you its preferred practice to solving this, but you are free to do whatever makes sense to you.

## Store as objects, compute to arrays
Why do we store data in arrays? And why do we store them as objects? So for example a list of users:

```js
// As array
[{
  id: '123',
  name: 'Bob'
}]

// As object
{
  '123': {
    id: '123',
    name: 'Bob'
  }
}
```

These ways of storing data has different benefits. Arrays are really great for views. Typically views only wants to map over an array of data and create a component for each item in array. Objects though are really great for lookups. If you have the ID of the user it requires way less computation and syntax to grab the user data:

```js
const id = '123'

const userFromArray = users.filter(user => user.id === id)[0]

const userFromObject = users[id]
```

So which one should you choose? Well, both! Use objects to structure data in the model and use arrays in your components. Let us see how to achieve that. Imagine you get this data structure from the server:

```js
[{
  id: '123',
  name: 'Bob'
},
...]
```

When this data is received you want to convert it to an object:

```js
function setUsers({props, state}) {
  const users = props.result.reduce((usersMap, user) => {
    usersMap[user.id] = user

    return usersMap
  }, {})

  state.set('app.users', users)
}
```

Now we have created a map of our users instead for easy lookup:

```js
{
  '123': {
    id: '123',
    name: 'Bob'
  },
  ...
}
```

So let us show all the users in a **Users** component. A naive implementation would be to just grab all the users in the component, iterate over them and create a new **User** component for each user and pass in the user. We will soon see why. So let us use a Computed to do this right:

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`app.users`,
  (users) => {
    return Object.keys(users)
  }
)
```

So here we are returning only the keys of all the users. Inside our **Users** component we will only pass the key of the user to the children:

```js
import {connect} from 'cerebral-view-whatever'
import usersKeys from '../../computed/usersKeys'
import User from '../User'

export default connect({
  usersKeys
},
  function Users(props) {
    return (
      <ul>
        {props.usersKeys.map((userKey) => (
          <User key={userKey} userKey={userKey} />
        ))}
      </ul>
    )
  }
)
```

With this approach we can now bind each user specifically to the state it needs, meaning that we isolate the rendering when any of the users update. That means only the component responsible for a specific user will render when that user changes:

```js
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'
export default connect({
  user: state`users.${props`userKey`}`
},
  function User(props) {
    return (
      <li>{props.user.name}</li>
    )
  }
)
```

So this is one of the benefits we get. Optimized rendering. Now lets look what happens when we want to sort our users. Back in our computed:

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`app.users`,
  state`app.sortOrder`,
  (users, sortOrder) => {
    return Object.keys(users).sort((userAKey, userBKey) => {
      const userA = users[userAKey]
      const userB = users[userBKey]

      if (userA.name.toLowerCase() > userB.name.toLowerCase()) {
        return sortOrder === 'asc' ? -1 : 1
      } else if (userA.name.toLowerCase() < userB.name.toLowerCase()) {
        return sortOrder === 'asc' ? 1 : -1
      }

      return 0
    })
  }
)
```

Now we have a really good data structure for doing lookups of users, but we also have a powerful concept of producing an array of data that the component can use. The good thing is that these computed will only run when their depending state changes and they are in use in the component.

What is also important to remember here is that doing these kind of plain javascript computations is extremely fast, it is rendering the view that takes time.

## Optimistic updates
But we can get other benefits from this as well. Instead of using the user ID as the key, we can create our own:

```js
import uuid from 'uuid'

function setUsers({props, state}) {
  const users = props.result.reduce((usersMap, user) => {
    usersMap[uuid.v4()] = user

    return usersMap
  }, {})

  state.set('app.users', users)
}
```
Everything works exactly the same, but now we have a client specific reference to our users, instead of ids. This allows us to do optimistic updates.

```js
import uuid from 'uuid'

function addUser({props, state, output}) {
  const newUserKey = uuid.v4()

  state.set(`app.users.${newUserKey}`, {
    id: null,
    name: props.name
  })

  return {newUserKey}
}
```

We also return the new userKey to the signal so that actions after it can use it to update the user with an ID when the server responds etc.

If you look at the [cerebral-todomvc](https://cerebral.github.io/todomvc) project you can see this pattern in action.
