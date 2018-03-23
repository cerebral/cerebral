# Server Side Rendering

Server side rendering is tricky business. There are numerous considerations to take and how you execute on these considerations depends on the application. Cerebral supports server side rendering and in this article we will look at the typical strategies to make this work.

## The flow

When you want to deliver content to your users as fast as possible, like with a progressive web app, or you just want to search engine optimize the application, you will need to render the UI on the server and return it on the initial request.

Let us imagine a user going to **www.example.com**. This request goes to the server and it will return some HTML, here showing example with Node express, manually returning the HTML string:

```js
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app"></div>
    <script src="/app.js"></script>
  </body>
</html>`)
})
```

This response is now displayed in the browser and the Cerebral application is ready to take over and your view library of choice will populate the `<div id="app"></div>` with the HTML of the app.

Now lets lay out the considerations we need to take regarding server side rendering:

1.  **Render components** - The minimum requirement is to actually render the components on the server inside the same `<div id="app"></div>` as the client will.

2.  **Universal Controller** - When your client fires up it might need some initial data from the server to display the content. With the help of the **Universal Controller** we can automate this process.

3.  **Synchronize with router** - If your application uses the Cerebral router it is not only initial data that possibly needs to be synchronized, but also the state that is related to what URL you are on.

```marksy
<Twitter text="There are several considerations you need to take evaluating SSR for your application" hashtags="cerebral"/>
```

## Render components

To render the components on the server they should be as pure as possible. By default components in a Cerebral app are kept pure because all business logic is contained in signals. That means it is safe to grab your root component on the server and render it:

```js
import App from '../client/components/App'
import { renderToString } from 'react-dom/server'

app.get('/', (req, res) => {
  const appHtml = renderToString(<App />)

  res.send(`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">${appHtml}</div>
    <script src="/app.js"></script>
  </body>
</html>`)
})
```

A good workflow for working with server side rendered components requires some packages and configuration. This is one approach to such a setup.

### Configure babel

First install babel dependencies with `npm install babel-loader babel-preset-es2015 babel-preset-react babel-plugin-transform-define`. Instead of configuring babel options inside your webpack config, you should do so in a `.babelrc` file:

```js
{
  "presets": ["es2015", "react"],
  "env": {
    "development": {
      "plugins": []
    },
    "production": {
      "plugins": [
        ["transform-define", {
          'process.env.NODE_ENV': 'production'
        }]
      ]
    }
  }
}
```

Now everything related to babel, it being webpack, node or direct babel build will use the same configuration.

### Development script

You will need to run both your server and the webpack development server for your client. This can be accomplished by `npm install concurrently webpack-dev-server babel-watch`. The webpack dev server will actually be your main development server, but it will proxy requests to your Node server as well. To configure this:

_webpack.config.js_

```js
const path = require('path')

const rules = [
  {
    test: /\.js?$/,
    include: [path.resolve('src', 'client')],
    use: [
      {
        loader: require.resolve('babel-loader')
      }
    ]
  }
]

module.exports = {
  entry: path.resolve('src', 'client', 'index.js'),
  output: {
    path: path.resolve('public'),
    filename: 'app.js',
    publicPath: '/'
  },
  module: {
    rules: rules
  },
  devServer: {
    port: 3000,
    proxy: {
      '/': 'http://localhost:3001'
    },
    hot: false,
    inline: false
  }
}
```

And your startup script in **package.json** should look like:

```js
{
  "scripts": {
    "start": "concurrently --prefix \"[{name}]\" --names \"CLIENT,SERVER\" -c \"white.bold,gray.bold\" \"webpack-dev-server\" \"babel-watch src/server/index.js --watch src\""
  },
  "build:client": "webpack",
  "build:server": "babel src/server --out-dir server-build"
}
```

What the _start_ line does is fire up two processes, _webpack-dev-server_ and _babel-watch_ , then it watches `src` folder for changes. Now any changes to your client or server files will allow you to just refresh your browser and the updates are there.

You build production bundles for your client and server separately.

## Universal Controller

Cerebrals universal controller allows you to mount your client side initial state on the server, execute logic to change that state and inject it with the server rendered app so that your client does not need to refetch the data.

To prepare your application for server side rendering it is a good idea to define the modules in its own file, that way you can reuse them on the server.

_modules/index.js_

```js
export { default as app } from './app'
export { default as admin } from './admin'
```

_controller.js_

```js
import { Controller } from 'controller'
import app from './app'

export default Controller(app)
```

Now on your server you can prepare your universal controller the same way:

```js
import {UniversalController} from 'cerebral'
import app '../client/app'
import App from '../client/components/App'
import {renderToString} from 'react-dom/server'

app.get('/', (req, res) => {
  const controller = UniversalController(app)
  const appHtml = renderToString(<App/>)

  res.send(`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">${appHtml}</div>
    <script src="/app.js"></script>
  </body>
</html>`)
})
```

This means that when the app is rendered it will have the same initial state, both on the client and the server. To actually produce some new state we need to execute logic and we do that using the **run** method:

```js
import { UniversalController } from 'cerebral'
import { Container } from 'cerebral/react'
import app from '../client/app'
import App from '../client/components/App'
import { renderToString } from 'react-dom/server'

function setInitialState({ state, props }) {
  state.set('app.user', props.user)
}

app.get('/', (req, res) => {
  const controller = UniversalController(app)

  db
    .getUser()
    .then(user => {
      return controller.run(setInitialState, { user })
    })
    .then(() => {
      const appHtml = renderToString(
        <Container controller={controller}>
          <App />
        </Container>
      )
      const stateScript = controller.getScript()

      res.send(`<!DOCTYPE html>
<html>
  <head>
    ${stateScript}
  </head>
  <body>
    <div id="app">${appHtml}</div>
    <script src="/app.js"></script>
  </body>
</html>`)
    })
})
```

Lets summarize the changes:

1.  We create a sequence, which is just one action, that expects to receive a user as a prop. This user is then put into the state

2.  Before we start rendering our application we go and grab a user from the database. When this user is fetched we run the controller passing in the user, making it available on the props

3.  When the execution is done we render the application by using the **Container** component which provides the controller to the components

4.  Now we can extract the script that contains the exact state changes made. The client will automatically pick up this script and produce the correct initial state of the application

5.  We put the script in the head

This is what you need to do if you want to put the client side application in a different state than the default one. There can be any number of reason for this, but beware... it is not strictly necessary. You might rather want to render your application in a "skeleton version" and then fetch the data needed from the client instead.

## Synchronize with router

If your whole application is run from a single route, **/**, you do not have to worry about this. But if you want to combine server side rendering with a router you need to make sure that the server does not diverge from what the router will do when it triggers on client load. Let us imagine we have the following router setup:

```js
import { Controller, Module } from 'cerebral'
import { set } from 'cerebral/operators'
import { state } from 'cerebral/tags'
import Router from '@cerebral/router'

const router = Router({
  routes: [
    {
      path: '/',
      signal: 'homeRouted'
    },
    {
      path: '/admin',
      signal: 'adminRouted'
    }
  ]
})

const app = Module({
  modules: { router },
  state: {
    currentPage: 'home'
  },
  signals: {
    homeRouted: set(state`currentPage`, 'home'),
    adminRouted: set(state`currentPage`, 'admin')
  }
})

export default Controller(app)
```

This is a pretty basic setup. When the router triggers it will, based on the url, change the **currentPage** state. That means when your user hits your server on either urls, the server needs to also set the correct state based on the url.

```js
import { UniversalController, Module } from 'cerebral'
import App from '../client/components/App'
import { Container } from 'cerebral/react'
import { renderToString } from 'react-dom/server'

function setInitialState({ state, props }) {
  let page
  if (props.path === '/') {
    page = 'home'
  } else if (props.path === '/admin') {
    page = 'admin'
  }
  state.set('page', page)
}

app.get('*', (req, res) => {
  const app = Module({
    state: {
      page: 'home'
    }
  })
  const controller = UniversalController(app)
  const mip = `hmm ${foo} ha`

  controller.run(setInitialState, { path: req.path }).then(() => {
    const appHtml = renderToString(
      <Container controller={controller}>
        <App />
      </Container>
    )
    const stateScript = controller.getScript()

    res.send(`<!DOCTYPE html>
<html>
  <head>
    ${stateScript}
  </head>
  <body>
    <div id="app">${appHtml}</div>
    <script src="/app.js"></script>
  </body>
</html>`)
  })
})
```

You would very likely create more specific routes and better handling of rendering the correct page, but this is just to give you an idea of how it works.

## Summary

Rendering on the server is not straight forward. It depends heavily on the app. Do you do routing, or do you want a skeleton app and do data fetching on client? How beneficial is it to grab state on server and inject it compared to making those requests from the client? There is no one right answer to this. But with Cerebral you have the tools you need to produce state on the server and rehydrate that state on the client, if you want to.
