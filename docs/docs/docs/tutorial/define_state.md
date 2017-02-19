# Define State

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/#/bins/-KdACuVE1vrPicewg7fm)

All interactive user interfaces need **state** in one way or another. Cerebral stores this state in something we call a **state tree**. You might be more familiar with frameworks where the state is described with classes, either multiple model classes and/or components. In Cerebral you do not put the state into multiple models or components. The state is not wrapped in classes either. You have this one state tree where you insert plain values. Objects, arrays, strings, numbers and boolean.

To define the initial state of the application all we need to do is to add it to our **Controller** in *src/index.js*

*controller.js*
```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: Devtools({
    remoteDebugger: '127.0.0.1:8585'
  }),
  state: {
    title: 'Cerebral Tutorial'
  }
})

export default controller
```

That's it! When you save your bin and look at the state tree you will see the state added. If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
