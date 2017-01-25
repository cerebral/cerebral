# Compute

Very often the components needs to produce state based on a combination of other state. A very typical example is to show items of a list based on a dynamic limit. The whole list is stored in your state tree, but you only want to show for example the 10 latest. Instead of defining this in the component itself, you can use **compute**.

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`items.limit`,
  state`items.list`,
  (limit, list) => {
    return items.filter((item, index) => index < limit)    
  }
)
```

To use this computed in your component:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import limitedList from '../../computed/limitedList'

export default connect({
  limitedList
},
  function List(props) {
    props.limitedList
  }
)
```

It would also be possible to pass in the limit as a property, maybe from the props passed into the component:

```js
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default function (passedLimit) {
  return compute(
    passedLimit,
    state`items.limit`,
    (limit, list) => {
      return items.filter((item, index) => index < limit)    
    }
  )
}
```

```js
import React from 'react'
import {connect} from 'cerebral/react'
import limitedList from '../../computed/limitedList'

export default connect({
  limitedList: limitedList(props`limit`)
},
  function List(props) {
    props.limitedList
  }
)
```

The computed values are automatically cached.

### Relational data
A challenge using a single state tree is handling relational data. Since data is typically stored in multiple places you need to bring them together. For example a user with projects. In Cerebral we favor storing data as objects due to advantages in lookups and optimistically creating new items. Let us look at an example of a state tree:

```js
{
  users: {
    'user-1': {
      name: 'Bob',
      projects: ['project-1', 'project-2']
    },
    'user-2': {
      name: 'Dale',
      projects: ['project-1']
    }
  },
  projects: {
    'project-1': {title: 'Awesome project'},
    'project-2': {title: 'Also awesome project'}
  }
}
```

We want to display a user with its related projects. Now... what to think of now is that even though projects relate to users it is not always the case that we want to show this data together. Maybe we only want to show data related to the user itself, or only the project. That is why we express this relationship when we bring the data into the component. So for example, only showing the user:

```js
// Only a user
connect({
  user: state`users.${props`userKey`}`
})
// Only a project
connect({
  user: state`projects.${props`projectKey`}`
})
```

If you want to bring in a user and its related projects you can define a computed for that. The way you would bring it into connect could be:

```js
connect({
  user: user(props`userKey`)
})
```

You would define **user** as:

```js
function user (passedUserKey) {
  return compute(
    passedUserKey,
    (userKey, get) => {
      const user = state(`users.${userKey}`)

      return {
        ...user,
        projects: user.projectIds.map((id) => get(state`projects.${id}`))
      }
    }
  )
}
```

Now your component depends on the user and any changes to its children. It also depends on each specific project of the user and any changes to their children.

But you could split this up. You could keep the **user** as:

```js
function user (passedUserKey) {
  return compute(
    passedUserKey,
    (userKey, get) => {
      return get(state`users.${userKey}`)
    }
  )
}
```

And rather add a new compute to grab the projects:

```js
const userProjects = compute((user, get) => {
  return {
    ...user,
    projects: user.projectIds.map((id) => get(state`projects.${id}`)
  }
})
```

And then you can choose what to grab in different components.

```js
// I only want the user
connect({
  user: user(props`userKey`)
})
// I want the user with projects
connect({
  user: compute(user(props`userKey`), userProjects)
})
```

So compute is a very powerful tool. It is up to the project and your preferences to use what makes most sense. Maybe you just need to use a simple computed, or maybe you need to take it up a notch and compose. Or maybe you do not even need compute at all and can just use tags.
