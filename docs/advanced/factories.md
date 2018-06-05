# Factories

A common concept in functional programming is factories. A factory is basically a function that creates a function:

```js
function createMessager(name) {
  function message(msg) {
    return `${name}, ${msg}`
  }

  return message
}

const message = createMessager('Bob')

message('what is happening?') // "Bob, what is happening?"
```

Creating a factory gives you the possibility to configure what a function should do before it is run. This is a perfect concept for Cerebral.

## Some example factories

So the typical factories you use with Cerebral are the operator factories:

```js
import { set, push } from 'cerebral/factories'
import { state } from 'cerebral'

export default [
  set(state.foo, 'bar'),
  push(state.list, 'foo')
]
```

But factories are also available in other packages, like [@cerebral/http](https://www.npmjs.com/package/@cerebral/http):

```js
import { httpGet } from '@cerebral/http/factories'

export default httpGet('/items')
```

So how does these factories actually work? Let us digest one of them.

## Dissecting a factory

Our example above was using the **httpGet** factory. To support the syntax above it would have to look like this:

```js
function httpGetFactory(url) {
  function httpGet({ http }) {
    return http.get(url)
  }

  return httpGet
}
```

When **httpGet** is called it will return a function, an action, for us. This action is configured with a url and when it is called it will run the http provider with the configured url.

But **httpGet** actually has more features than this. You can use a *string tag* instead of a normal string.

```js
import { httpGet } from '@cerebral/http/factories'
import { props, string } from 'cerebral'

export default httpGet(string`items/${props.itemId}`)
```

Here we have configured our function to produce the url based on the property **itemId** passed through the signal. How do we handle that inside our operator?

### Resolve values

Instead of using the url directly, like we do here:

```js
function httpGetFactory(url) {
  function httpGet({ http }) {
    return http.get(url)
  }

  return httpGet
}
```

We can rather resolve it, using the **get** provider:

```js
function httpGetFactory(url) {
  function httpGet({ http, get }) {
    return http.get(get(url))
  }

  return httpGet
}
```

By using **get** we allow passing in a value to be evaluated. It can still be just a plain string, no worries, but now we can also use proxies.

### Optional paths

The factories of the **@cerebral/http** package has a pretty cool feature which allows you to optionally use paths. For example:

```js
import { httpGet } from '@cerebral/http/factories'

export default httpGet('/items')
```

Or:

```js
import { httpGet } from '@cerebral/http/factories'

export default [
  httpGet('/items'),
  {
    sucess: [],
    error: []
  }
]
```

You can even base the paths on status codes:

```js
import { httpGet } from '@cerebral/http/factories'

export default [
  httpGet('/items'),
  {
    success: [],
    404: [],
    error: []
  }
]
```

This gives a lot of flexibility, but how does it work? Let us do some more digesting:

```js
function httpGetFactory(url) {
  function httpGet({ http, get, path }) {
    if (path) {
      // More to come
    } else {
      return http.get(get(url))
    }
  }

  return httpGet
}
```

We can actually check if **path** exists on the context of the action. If it does not exist, it means that the action can not diverge execution down a path:

```js
function httpGetFactory(url) {
  function httpGet({ http, get, path }) {
    if (path) {
      return http
        .get(get(url))
        .then((response) => {
          return path.success({ response })
        })
        .catch((error) => {
          return path.error({ error })
        })
    } else {
      return http.get(get(url))
    }
  }

  return httpGet
}
```

So based on the path existing or not we call the expected *success* and *error* paths respectively.

But what about the status codes? Lets extend our example:

```js
function httpGetFactory(url) {
  function httpGet({ http, get, path }) {
    if (path) {
      return http
        .get(get(url))
        .then((response) => {
          return path[response.status]
            ? path[response.status]({ response })
            : path.success({ response })
        })
        .catch((error) => {
          return path[error.status]
            ? path[error.status]({ error })
            : path.error({ error })
        })
    } else {
      return http.get(get(url))
    }
  }

  return httpGet
}
```

### Resolve proxy paths

You can also resolve the paths of a proxy. For example:

```js
state.foo.bar
```

The path in this example is **foo.bar**. Or:

```js
state.items[props.itemId]
```

This might resolve to **items.123**.

Resolving the path instead of the value within the path gives some contextual power. For example the core Cerebral factories uses this feature:

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

export default set(state.foo, props.foo)
```

So here we are using two proxies, **state** and **props**, and they have two different contextual meanings. The **state** proxy is used to identify *where* to put a value, and the **props** proxy is used to identify *what* value.

Since proxies are transpiled into tags with the babel plugin, you treat them as tags using the **resolve** provider:

```js
function setFactory(target, value) {
  function set({ state, resolve }) {
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

## Enhancing your factories

You will very likely create a lot of action factories in your application. This drys up your code and makes your sequences more expressive. If you start using the **get** provider, and even the **resolver**, you can make your factories even more expressive. One such factory could be notifying the user:

```js
import factories from './factories'
import { string, state } from 'cerebral'

export default notify(string`Sorry ${state.user.name}, this does not work :(`)
```

The factory could look something like this:

```js
import { state } from 'cerebral'

function notifyFactory(message) {
  function notify({ store, get }) {
    store.set(state.message, get(message))
  }

  return notify
}
```

## Summary

You might build your whole application without taking advantage of resolving proxies in your factories, but it is a powerful concept that can express more logic in your sequence definitions making your code even more readable.
