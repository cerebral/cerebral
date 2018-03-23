# Modules

```marksy
<Youtube url="https://www.youtube.com/embed/QJnDxez9qtY" />
```

The base structuring building block of Cerebral is the **Module**. The Cerebral modules can be looked at as namespaces for logic. While they do encapsulate, they do not isolate. That means any module can change the state of any other module.

```js
import { Module } from 'cerebral'

export default Module({
  state: {
    foo: 'bar'
  }
})
```

You attach the root module to the controller:

```js
import { Controller } from 'cerebral'
import app from './app'

export default Controller(app)
```

You can also define your module as a function, returning a module definition. This function will receive the **name** of the module, the **path** to it and also the **controller** instance.

```js
import { Module } from 'cerebral'

export default Module(({ name, path, controller }) => {
  return {
    state: {}
  }
})
```

This information can be useful in more complex setups where your module wants to listen for the _initialized_ event of the controller for example.

## Submodules

A module can also use a **modules** property to attach nested modules.

```js
import foo from './modules/foo'

export default {
  state: {},
  modules: {
    foo
  }
}
```

```marksy
<CodeSandbox url="https://codesandbox.io/embed/q4qz00wkp6?view=editor" />
```
