# Providers

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
import { Controller } from 'cerebral'
import greeter from './providers/greeter'

export default Controller({
  providers: { greeter }
})
```

You can also add a provider using a function. This will expose the "raw context", meaning you can call other providers in your returned methods.
When using a function you get access to the context. That means you can grab static stuff from the context, typically trigger a signal. This provider is automatically wrapped by the debugger, where available.

```js
import { Provider } from 'cerebral'

export default Provider((context) => {
  return {
    triggerSignalOnNativeEvent(event, signalPath) {
      window.addEventListener(event, () => {
        context.controller.getSignal(signalPath)()
      })
    }
  }
})
```
