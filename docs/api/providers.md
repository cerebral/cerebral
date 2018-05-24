# Providers

A provider exposes functionality to your actions. Typically to run side effects. Each action has a unique context object where the providers are populated.

This provider is automatically wrapped by the debugger, where available.

```js
export const greetProvider = {
  greet() {
    return 'hello'
  }
}
```

```js
import * as providers from './providers'

export default {
  providers
}
```

You also have access to the context inside your provider. This will allow you to leverage existing providers. The context is exposed as `this.context`. This keeps the API concise and under the hood we can do prototypal optimizations.

```js
export default {
  triggerSignalOnNativeEvent(event, sequence) {
    window.addEventListener(event, () => {
      this.context.get(sequence)()
    })
  }
}
```

## Provider

You can optionally use the **Provider** factory. It allows you to pass some potions related to debugging:

```js
import { Provider } from 'cerebral'

export const myProvider = Provider({}, {
  wrap: false
})
```

This provider will not be tracked by debugger. Optionally you can intercept how the provider should work when wrapped by the devtools:

```js
import { Provider } from 'cerebral'

export const myProvider = Provider({}, {
  wrap(context) {
    return {}
  }
})
```

A provider can also by defined as a function which receives the current context. This prevents some optimizations, but might be necessary:
```js
export const greetProvider = (context) => {
  return {}
}
```