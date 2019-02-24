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

1.  **Render components** - The minimum requirement is to actually render the components on the server inside the same `<div id="app"></div>` as the client will

2.  **Universal Cerebral App** - When your client fires up it might need some initial data from the server to display the content. With the help of the **Universal Cerebral App** we can automate this process

3.  **Synchronize with router** - If your application uses the Cerebral router it is not only initial data that possibly needs to be synchronized, but also the state that is related to what URL you are on

## Render components

To render the components on the server they should be as pure as possible. By default components in a Cerebral app are kept pure because all application logic is contained in sequences and actions. That means it is safe to grab your root component on the server and render it:

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

### Run Node with Babel

To bring your components into Node you should run Node with the [babel-node](https://babeljs.io/docs/usage/cli/#babel-node) project. Make sure this is not run in production though. You will need to build the server files as well.

## Universal Controller

Cerebrals universal app allows you to mount your client side initial state on the server, execute logic to change that state and inject it with the server rendered app so that your client does not need to refetch the data.

```js
import { UniversalApp } from 'cerebral'
import main from '../client/main'
import AppComponent from '../client/components/App'
import {renderToString} from 'react-dom/server'

app.get('/', (req, res) => {
  const app = UniversalApp(main)
  const appHtml = renderToString(<AppComponent/>)

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
import { UniversalApp, state } from 'cerebral'
import main from '../client/main'
import AppComponent from '../client/components/App'
import {renderToString} from 'react-dom/server'

function setInitialState({ store, props }) {
  store.set(state.app.user, props.user)
}

app.get('/', (req, res) => {
  const app = UniversalApp(main)

  db
    .getUser()
    .then((user) => {
      return app.run(setInitialState, { user })
    })
    .then(() => {
      const appHtml = renderToString(
        <Container app={app}>
          <App />
        </Container>
      )
      const stateScript = app.getScript()

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

2.  Before we start rendering our application we go and grab a user from the database. When this user is fetched we run the app passing in the user, making it available on the props

3.  When the execution is done we render the application by using the **Container** component which provides the app to the components

4.  Now we can extract the script that contains the exact state changes made. The client will automatically pick up this script and produce the correct initial state of the application

5.  We put the script in the head

This is what you need to do if you want to put the client side application in a different state than the default one. There can be any number of reason for this, but beware... it is not strictly necessary. You might rather want to render your application in a "skeleton version" and then fetch the data needed from the client instead.

## Summary

Rendering on the server is not straight forward. It depends heavily on the app. Do you do routing, or do you want a skeleton app and do data fetching on client? How beneficial is it to grab state on server and inject it compared to making those requests from the client? There is no one right answer to this. But with Cerebral you have the tools you need to produce state on the server and rehydrate that state on the client, if you want to.
