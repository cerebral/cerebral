# Providers
*since version 4.0*

A provider exposes functionality to your actions. Typically to run side effects. Each action has a unique context object where the providers are populated.

This provider is automatically wrapped by the debugger, where available.

```js
import { Provider } from 'cerebral'

export default Provider({
  greet() {
    return 'hello'
  }
})
```

```js
import { Controller, Module } from 'cerebral'
import greeter from './providers/greeter'

const app = Module({
  providers: { greeter }
})

export default Controller(app)
```

You also have access to the context inside your provider. This will allow you to leverage existing providers. The context is exposed as `this.context`. This keeps the API concise and under the hood we can do prototypal optimizations.


```js
import { Provider } from 'cerebral'

export default Provider({
  triggerSignalOnNativeEvent(event, signalPath) {
    window.addEventListener(event, () => {
      this.context.controller.getSignal(signalPath)()
    })
  }
})
```
