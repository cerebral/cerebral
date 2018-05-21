# Universal App

The Universal Controller allows you to put your application in its initial state on the server. In combination with your chosen view layer you can now render the application on the server and show it near instantly in the context of the current user. When the client side application loads it will piggyback on the existing DOM and effectively rehydrate the minimal state from the server to make it up to date, meaning that the pure HTML responded from your server and the loading of the actual application is transparent.

Read more about server side rendering in the [SSR guide](/docs/guides/ssr).

**Note** that when using JSX syntax it is wise to also transpile your server side code, which this example shows.

```js
import { UniversalApp } from 'cerebral'
import main from './main'

const app = UniversalApp(main)
```

## Methods

### runSequence

If you need to update the state of the controller you can run a signal execution for doing so:

```js
import { UniversalApp } from 'cerebral'
import { state } from 'cerebral/proxy'
import main from './main'

const app = UniversalApp(main)

app
  .runSequence(
    [
      function myAction({ store, props }) {
        store.set(state.isAwesome, props.isAwesome)
      }
    ],
    {
      isAwesome: true
    }
  )
  .then(() => {
    // I am done running
  })
```

You can run a predefined sequence, which is defined inside a module as well:

```js
import { UniversalApp } from 'cerebral'
import main from './main'

const app = UniversalApp(main)

controller.runSequence('some.module.aSequence', { isAwesome: true }).then(() => {
  // I am done running
})
```

**NOTE!** You should instantiate the app for each run you want to do.

### setState

Finally, you can (synchronously) set a value inside the state directly, using a path:

```js
import { UniversalApp } from 'cerebral'
import main from './main'

const app = UniversalApp(main)

app.setState('app.foo', 123)
```

### getChanges

Returns a map of the changes made.

```js
import { UniversalApp } from 'cerebral'
import main from './main'

const app = UniversalApp(main)

app.runSequence('app.aSequence', { isAwesome: true }).then(() => {
  app.getChanges() // {"app.isAwesome": true}
})
```

### getScript

When the client side application loads it will do its first render with the default state, meaning that if the server updated the state this is now out of sync. Using the **getScript** method you will get a script tag you can inject into the _HEAD_ of the returned HTML. Cerebral will use this to bring your client side application state up to date with the server.

```js
import { UniversalApp } from 'cerebral'
import { state } from 'cerebral/proxy'
import main from './main'
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

const app = UniversalApp(main)

app
  .run(
    [
      function myAction({ store, props }) {
        store.set(state.app.isAwesome, props.isAwesome)
      }
    ],
    {
      isAwesome: true
    }
  )
  .then(() => {
    const index = indexTemplate.replace(
      '{{CEREBRAL_SCRIPT}}',
      app.getScript()
    )
  })
```

## Render

Depending on the view layer of your choice you can bring all of this together:

```js
import React from 'react'
import express from 'express'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { UniversalApp } from 'cerebral'
import { Container } from 'cerebral/react'
import main from '../client/main'
import AppComponent from '../client/components/App'
import loadAppSequence from './loadAppSequence'

const server = express()
const indexTemplate = fs.readFileSync('index.template.html').toString()

server.get('/', (req, res) => {
  const app = UniversalApp(main)

  app
    .run(loadAppSequence, {
      query: req.query,
      useragent: req.headers['user-agent']
    })
    .then(() => {
      const index = indexTemplate
        .replace('{{CEREBRAL_SCRIPT}}', app.getScript())
        .replace(
          '{{APP}}',
          renderToString(
            <Container app={app}>
              <App />
            </Container>
          )
        )

      res.send(index)
    })
})

server.listen(3000)
```

## Transpile server code

You should run and build your Node instance with `babel`. Take a look at how you can run Node with babel [over here](https://babeljs.io/docs/usage/cli/#babel-node).
