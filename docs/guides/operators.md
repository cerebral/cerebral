# Operators

A common concept in programming is factories. A factory is basically a function that creates a function:

```js
function createMessager (name) {
  function message (msg) {
    return `${name}, ${msg}`
  }
  
  return message
}

const message = createMessager('Bob')

message('what is happening?') // "Bob, what is happening?"
```

Creating a factory gives you the possibility to configure what a function should do before it is run. This is a perfect concept for Cerebral, it is such a perfect concept that we highlight as a core feature called **operators**.

## Some example operators

So the typical operators you use with Cerebral are the state operators:

```js
import {set, push} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo`, 'bar'),
  push(state`list`, 'foo')
]
```

But operators are also available in other packages, like [@cerebral/http](https://www.npmjs.com/package/@cerebral/http):

```js
import {httpGet} from '@cerebral/http/operators'

export default [
  httpGet('/items')
]
```

So how does these operators actually work? Let us digest one of them.

## Dissecting an operator

Our example above was using the **httpGet** operator. To support the syntax above it would have to look like this:

```js
function httpGetFactory (url) {
  function httpGet ({http}) {
    return http.get(url)
  }
  
  return httpGet
}
```

When **httpGet** is called it will return a function, an action, for us. This action is configured with a url and when it is called it will run the http provider with the configured url.

But **httpGet** actually has more features than this. You can use a *string tag* instead of a normal string.

```js
import {httpGet} from '@cerebral/http/operators'
import {string, props} from 'cerebral/tags'

export default [
  httpGet(string`items/${props`itemId`}`)
]
```

Here we have configured our function to produce the url based on the property **itemId** passed through the signal. How do we handle that inside our operator?

### Resolve values

Instead of using the url directly, like we do here:

```js
function httpGetFactory (url) {
  function httpGet ({http}) {
    return http.get(url)
  }
  
  return httpGet
}
```

We can rather resolve it, using the **resolve** provider:

```js
function httpGetFactory (url) {
  function httpGet ({http, resolve}) {
    return http.get(resolve.value(url))
  }
  
  return httpGet
}
```

By using the resolver we evaluate the tag used to "configure" the returned action. It can still be just a plain string, no worries, but now we can also use tags and even a computed.

### Optional paths

The operators of the **@cerebral/http** package has a pretty cool feature which allows you to optionally use paths. For example:

```js
import {httpGet} from '@cerebral/http/operators'

export default [
  httpGet('/items')
]
```

Or:

```js
import {httpGet} from '@cerebral/http/operators'

export default [
  httpGet('/items'), {
    sucess: [],
    error: []
  }
]
```

You can even base the paths on status codes:

```js
import {httpGet} from '@cerebral/http/operators'

export default [
  httpGet('/items'), {
    success: [],
    404: [],
    error: []
  }
]
```

This gives a lot of flexibility, but how does it work? Let us do some more digesting:

```js
function httpGetFactory (url) {
  function httpGet ({http, resolve, path}) {
    if (path) {
      // More to come
    } else {
      return http.get(resolve.value(url))
    }
  }
  
  return httpGet
}
```

We can actually check if **path** exists on the context of the action. If it does not exist, it means that the action can not diverge execution down a path:

```js
function httpGetFactory (url) {
  function httpGet ({http, resolve, path}) {
    if (path) {
      return http.get(resolve.value(url))
        .then((response) => {
          return path.success({response})
        })
        .catch((error) => {
          return path.error({error})
        })
    } else {
      return http.get(resolve.value(url))
    }
  }
  
  return httpGet
}
```

So based on the path existing or not we call the expected *success* and *error* paths respectively. 

But what about the status codes? Lets extend our example:

```js
function httpGetFactory (url) {
  function httpGet ({http, resolve, path}) {
    if (path) {
      return http.get(resolve.value(url))
        .then((response) => {
          return (
            path[response.status] ?
              path[response.status]({response})
            :
              path.success({response})
          )
        })
        .catch((error) => {
          return (
            path[error.status] ?
              path[error.status]({error})
            :
              path.error({error})
          )
        })
    } else {
      return http.get(resolve.value(url))
    }
  }
  
  return httpGet
}
```

### Resolve tag paths

You can also resolve the paths of a tag. For example:

```js
state`foo.bar`
```

The path in this example is **foo.bar**. Or:

```js
state`items.${props`itemId`}`
```

This might resolve to **items.123**.

Resolving the path instead of the value within the path gives some contextual power. For example the core Cerebral operators uses this feature:

```js
import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

export default [
  set(state`foo`, props`foo`)
]
```

So here we are using two tags, **state** and **props**, and they have two different contextual meanings. The **state** tag is used to identify *where* to put a value, and the **props** tag is used to identify *what* value.

So this is a simple implementation of that:

```js
function setFactory (target, value) {
  function set ({state, resolve}) {
    // First we identify that we have the tag
    // type we want
    const isStateTag = resolve.isTag(target, 'state')
    
    // We use the type of tag to identify
    // where we want to do a "set"
    if (isStateTag) {
      // We extract the path, "foo", so that
      // we know where to set the value
      const statePath = resolve.path(target)
      
      // We do a normal "state.set" with the
      // resolved path and value
      state.set(statePath, resolve.value(value))
    } else {
      throw new Error('Target must be a state tag')
    }
  }
  
  return set
}

export default setFactory
```

As you can see we used `resolve.path` for the **state** tag and `resolve.value` for the **props** tag. This is because the "target tag" is used to identify at what target and where we want to put a value, and the "value tag" is used to extract the actual value.

## Enhancing your action factories

You will very likely create a lot of action factories in your application. This drys up your code and makes your signals more expressive. If you start using the **resolver** you can make your action factories even more expressive, as they basically get the same behaviour as operators. One such action factory could be notifying the user:

```js
import notify from '../factories/notify'
import {string} from 'cerebral/tags'

export default [
  notify(string`Sorry ${state`user.name`}, this does not work :(`)
]
```

Since the string tag can not look up a value, unlike **state** and **props**, both `resolve.path` and `resolve.value` resolves to the path. Meaning that the **notify** factory could look something like this:

```js
function notifyFactory (message) {
  function notify ({state, resolve}) {
    state.set('message', resolve.value(message))
  }
  
  return notify
}
```

## Summary
You might build your whole application without taking advantage of tags in your action factories, but it is a powerful concept that can express more logic in your signal definitions making your code even more readable.

