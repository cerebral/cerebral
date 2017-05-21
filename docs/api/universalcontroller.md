# Universal Controller

```js
import {UniversalController} from 'cerebral'
import appModule from '../client/modules/app'

const controller = UniversalController({
  // Same API as Controller
  // Here loading the same modules as the
  // client loads
  modules: {
    app: appModule
  }
})
```

## Methods
### run
If you need to update the state of the controller you can run a signal execution for doing so:

```js
import {UniversalController} from 'cerebral'
import appModule from '../client/modules/app'

const controller = UniversalController({
  modules: {
    app: appModule
  }
})

controller.run([
  function myAction ({state, props}) {
    state.set('app.isAwesome', props.isAwesome)
  }
], {
  isAwesome: true
})
  .then(() => {
    // I am done running
  })
```

You can add any providers to the controller to do database fetching etc. inside this **run** execution. Think of it as a signal the updates the state of the app before rendering it on the server.

**NOTE!** This method resets the state and previous changes of the controller, meaning that you can reuse the same controller multiple times.

### getScript
When the client side application loads it will do its first render with the default state, meaning this might be out of sync with the updates done on the server. Using the **getScript** method you will get a script tag you can inject into the *HEAD* of the returned HTML. Cerebral will use this to bring your client side application state up to date with what was on the server.

```js
import {UniversalController} from 'cerebral'
import appModule from '../client/modules/app'
import fs from 'fs'

/*
  <!DOCTYPE html>
  <html>
    <head>
      {{CEREBRAL_SCRIPT}}
    </head>
    <body>
      <div id="app">{{APP}}</div>
    </body>
  </html>
*/
const indexTemplate = fs.readFileSync('index.template.html').toString()

const controller = UniversalController({
  modules: {
    app: appModule
  }
})

controller.run([
  function myAction ({state, props}) {
    state.set('app.isAwesome', props.isAwesome)
  }
], {
  isAwesome: true
})
  .then(() => {
    const index = indexTemplate
      .replace('{{CEREBRAL_SCRIPT}}', controller.getScript())
  })
```

## Render
Depending on the view layer of your choice you can bring all of this together:

```js
import React from 'react'
import express from 'express'
import fs from 'fs'
import {renderToString} from 'react-dom/server'
import {UniversalController} from 'cerebral'
import {Container} from 'cerebral/react'
import appModule from '../client/modules/app'
import App from '../client/components/App'
import loadApp from './loadApp'

const server = express()
const indexTemplate = fs.readFileSync('index.template.html').toString()
const controller = UniversalController({
  modules: {
    app: appModule
  }
})

server.get('/', (req, res) => {
  controller.run(loadApp, {
      query: req.query,
      useragent: req.headers['user-agent']
    })
      .then(() => {
        const index = indexTemplate
          .replace('{{CEREBRAL_SCRIPT}}', controller.getScript())
          .replace('{{APP}}', renderToString(
            <Container controller={controller}><App /></Container>
          ))

        res.send(index)
      })
})

server.listen(3000)
```

## ES6 on server
Take a look at the [demo application](https://github.com/cerebral/cerebral/tree/master/demos/universal) to see how you can run modern javascript, also with JSX, on the server. Demo does not include building for production, but you would typically use Webpack as normal for the client and just babel for the server. Or you can use Webpack there as well.
