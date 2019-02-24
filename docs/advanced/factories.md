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

So the typical factories you use with Cerebral changes the state:

```js
import { set, push } from 'cerebral/factories'
import { state } from 'cerebral'

export default [
  set(state`foo`, 'bar'),
  push(state`list`, 'foo')
]
```

But you could also create a factory to for example get data from the server:

```js
import { state, props } from 'cerebral'
import { set } from 'cerebral/factories'
import { httpGet } from './myFactories'

export default [
  httpGet('/items'),
  set(state`items`, props`response.data`)
]
```

So how would this **httpGet** factory actually work? Let us dissect it.

## Dissecting a factory

The **httpGet** factory above could look something like this:

```js
function httpGetFactory(url) {
  function httpGetAction({ http }) {
    return http.get(url).then(response => ({ response }))
  }

  return httpGetAction
}
```

When **httpGet** is called it will return a function, an action, for us. This action is configured with a url and when it is called it will run a method on a provider we have named **http**. In this case the http provider calls the server and returns the response to props as `{ response: [...] }`.

But **httpGet** actually has more features than this. You can use a *string tag* instead of a normal string.

```js
import { state, props, string } from 'cerebral'
import { set } from 'cerebral/factories'
import { httpGet } from './myFactories'

export default [
  httpGet(string`items/${props.itemId}`),
  set(state`item`, prop`response.data`)
]
```

Here we have configured our function to produce the url based on the property **itemId** passed through the signal. How do we handle that inside our operator?

### Resolve values

Instead of using the url directly, like we do here:

```js
function httpGetFactory(url) {
  function httpGetAction({ http }) {
    return http.get(url).then(response => ({ response }))
  }

  return httpGetAction
}
```

We can rather resolve it, using the **get** provider:

```js
function httpGetFactory(url) {
  function httpGetAction({ http, get }) {
    return http.get(get(url)).then(response => ({ response }))
  }

  return httpGetAction
}
```

By using **get** we allow passing in a value to be evaluated. It can still be just a plain string, no worries, but now we can also use tags.

### Optional paths

The sequences of Cerebral a pretty cool feature which allows you to optionally use paths. For example:

```js
import { httpGet } from './myFactories'

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
import { httpGet } from './myFactories'

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
  function httpGetAction({ http, get, path }) {
    if (path) {
      // More to come
    } else {
      return http.get(get(url)).then(response => ({ response }))
    }
  }

  return httpGetAction
}
```

We can actually check if **path** exists on the context of the action. If it does not exist, it means that the action can not diverge execution down a path. That means we can support both scenarios:

```js
import { state, props } from 'cerebral'
import { set } from 'cerebral/factories'
import { httpGet } from './myFactories'

export const scenarioA = [
  httpGet('/items'),
  {
    sucess: set(state`items`, props`response.data`),
    error: []
  }
]

export const scenarioB = [
  httpGet('/items'),
  set(state`items`, props`response.data`)
]
```

```js
function httpGetFactory(url) {
  function httpGetAction({ http, get, path }) {
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
      return http.get(get(url)).then(response => ({ response }))
    }
  }

  return httpGetAction
}
```

So based on the path existing or not we call the expected *success* and *error* paths respectively.

But what about the status codes? Lets extend our example:

```js
function httpGetFactory(url) {
  function httpGetAction({ http, get, path }) {
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
      return http.get(get(url)).then(response => ({ response }))
    }
  }

  return httpGetAction
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

Resolving the path instead of the value within the path gives some contextual power. For example the core Cerebral factories uses this feature:

```js
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral'

export default set(state`foo`, props`foo`)
```

So here we are using two tags, **state** and **props**, and they have two different contextual meanings. The **state** tag is used to identify *where* to put a value, and the **props** tag is used to identify *what* value.

```js
function setFactory(target, value) {
  function set({ store, resolve }) {
    // First we identify that we have the tag
    // type we want
    const isStateTag = resolve.isTag(target, 'state')

    // We use the type of tag to identify
    // where we want to do a "set"
    if (isStateTag) {
      // We extract the path, "foo", so that
      // we know where to set the value
      const statePath = resolve.path(target)

      // We do a normal "store.set" with the
      // resolved path and value
      store.set(statePath, resolve.value(value))
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
import { notify } from './myFactories'
import { string, state } from 'cerebral'

export default notify(string`Sorry ${state`user.name`}, this does not work :(`)
```

The factory could look something like this:

```js
import { state } from 'cerebral'

function notifyFactory(message) {
  function notifyAction({ store, get }) {
    store.set('message', get(message))
  }

  return notifyAction
}
```

## Summary

You might build your whole application without taking advantage of resolving tags in your factories, but it is a powerful concept that can express more logic in your sequence definitions making your code even more readable.
