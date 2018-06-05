# Compute

Computeds calculate and cache derived state values. Using computeds helps to keep logic out of the application view components and improves performance.

```js
import { Compute, state } from 'cerebral'

export default Compute({
  userName: state.user.name,
}, ({ userName }) => {
  return `Hi ${name}`
})
```

A computed takes a map of dependencies. Proxies will be resolved to a value when the computed executes. 

All computed also has a **get** property, it allows you to manually extract values that will become dynamic dependencies of the computed:

```js
import { Compute, state, props } from 'cerebral'

export default Compute({
  userId: state.user.id
}, ({ userId, get }) => {
  return get(state.projects[userId]).length > get(props.limit)
})
```
