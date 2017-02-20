# Define State

**Before you start,** [load this BIN on Webpackbin](https://webpackbin-prod.firebaseapp.com/#/bins/-KdACuVE1vrPicewg7fm)

All interactive user interfaces need **state** in one way or another. Cerebral stores this state in something that we call a **state tree**. You might be more familiar with frameworks where application state is described using classes, either multiple model classes and/or components. In Cerebral you do not put application state into multiple models or components. Your application state  isn't wrapped in any form of class either. As a developer you have access to a single state tree where you insert plain values; objects, arrays, strings, numbers and booleans.

To define the initial state of any application all we need to do is to add it to our **Controller** in *controller.js*


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
