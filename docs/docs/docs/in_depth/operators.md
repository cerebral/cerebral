# Operators

Everything that happens in a signal is based on actions. But these actions can be dynamic, in the sense that you rather call a function with some parameters and based on those parameters creates a function for you. This is what operators is all about.

For example:

```js
import {wait} from 'cerebral/operators'

export default [
  wait(200), {
    continue: []
  }
]
```

The *wait* function returns an action based on the parameter passed in. Let us look at how it is implemented.

```js
function waitFactory (ms) {
  function wait ({path}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(path.continue())
      }, ms)
    })
  }

  return wait
}
```

So operators are quite simple as you can see. A more generic term is *action factories*, which you most certainly will take advantage of in your own application. So operators are really the core *action factories* of Cerebral.
