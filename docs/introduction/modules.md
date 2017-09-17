# Modules

```marksy
<Youtube url="https://www.youtube.com/embed/QJnDxez9qtY" />
```

As your application grows it is a good idea to organize the logic, not just in files, but also in code. The Cerebral modules can be looked at as namespaces for logic. While they do encapsulate, they do not isolate. That means any module can change the state of any other module.

A module is just an object where you will mostly use the **state** and **signals** property.

```js
import somethingHappened from './signals/somethingHappened'

export default {
  state: {
    foo: 'bar'
  },
  signals: {
    somethingHappened
  }
}
```

To actually use the module you attach it to the controller:

```js
import {Controller} from 'cerebral'
import app from './modules/app'

const controller = Controller({
  modules: { app }
})
```

There is really nothing more to it. Now the state is namespaced by **app.foo**, the same goes for the signal **app.somethingHappened**.

You can also define your module as a function, returning a module definition. This function will receive the **name** of the module, the **path** to it and also the **controller** instance.

```js
export default ({name, path, controller}) => {
  return {
    state: {},
    signals: {}
  }
}
```

This information can be useful in more complex setups where your module wants to listen for the *initialized* event of the controller for example.

## Submodules
A module can also use a **modules** property to attach nested modules.

```js
import foo from './modules/foo'

export default {
  state: {},
  signals: {},
  modules: {
    foo
  }
}
```

## Provider
A module can attach a provider to the controller by using the **provider** property.

```js
import {provide} from 'cerebral'

export default {
  state: {},
  signals: {},
  providers: provide('whatevah', {
    foo() {},
    bar() {}
  })
}
```

To play around with modules [have a look at this BIN](https://www.webpackbin.com/bins/-Kp_1KYmZOBjswsaTUAC).
