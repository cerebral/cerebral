# Views

There are several views you can connect Cerebral to and it is mostly a matter of preference. Let us look at a couple of examples.

You could install [React](https://reactjs.org/) by running the following command in the terminal:

`npm install react react-dom @cerebral/react`

And then in the root **index.js** file you can add:

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'
import React from 'react'
import { render } from 'react-dom'
import { Container } from '@cerebral/react'
import AppComponent from './AppComponent'

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

const app = App({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      set(state.isLoadingUser, true),
      getUser,
      set(state.users[props.id], props.user),
      set(state.currentUserId, props.id),
      set(state.isLoadingUser, false)
    ]
  },
  providers: {
    jsonPlaceholder: {
      getUser(id) {
        return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
          .then((response) => response.json())
      }
    }
  }  
}, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})

render(
  <Container app={app}>
    <AppComponent />
  </Container>,
  document.querySelector('#app')
)
```

And your **App** component located in `src/App.js` could look like:

```js
import React from 'react'
import { state, sequences } from 'cerebral/proxy'
import { connect } from '@cerebral/react'

export default connect(
  {
    user: state.users[state.currentUserId],
    click: sequences.loadUser
  },
  function MyComponent({ user, click }) {
    return (
      <div>
        <h1>Hello {user ? user.name : 'nobody'}</h1>
        <button onClick={() => click({ id: 1 })}>Get user 1</button>
      </div>
    )
  }
)
```

If you rather prefer [Vue](https://vuejs.org/) you could connect Cerebral in a similar way by first running the following command in the terminal:

`npm vue @cerebral/vue`

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import { set } from 'cerebral/factories'
import { state, props } from 'cerebral/proxy'
import Vue from 'vue/dist/vue'
import { Container, connect } from '@cerebral/vue'
import AppComponent from './AppComponent'

const getUser = ({ jsonPlaceholder, props }) =>
  jsonPlaceholder.getUser(props.id).then(user => ({ user }))

const app = App({
  state: {
    title: 'My Project',
    users: {},
    currentUserId: null,
    isLoadingUser: false,
    error: null
  },
  sequences: {
    loadUser: [
      set(state.isLoadingUser, true),
      getUser,
      set(state.users[props.id], props.user),
      set(state.currentUserId, props.id),
      set(state.isLoadingUser, false)
    ]
  },
  providers: {
    jsonPlaceholder: {
      getUser(id) {
        return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
          .then((response) => response.json())
      }
    }
  }  
}, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})

const vue = new Vue({
  el: '#app',
  components: {
    container: Container(app),
    app: AppComponent
  }
})
```

And you would define the component like this:

```js
import { connect } from '@cerebral/vue'
import { state, sequences } from 'cerebral/proxy'

export default connect(
  {
    user: state.users[state.currentUserId],
    click: sequences.loadUser
  },
  {
    template: `
      <div>
        <h1>Hello {{user ? user.name : 'nobody'}}</h1>
        <button v-on:click="click({ id: 1})">Get user 1</button>
      </div>
`
  }
)
```

With Vue you would also need to update the **index.html** file with the following code:

```html
<div id="app">
  <container>
    <app></app>
  </container>
</div>
```

You would of course be able to use **.vue** files as well here. Read more about that in [@cerebral/vue](/views/vue).

The point is that for Cerebral it does not really matter. Cerebral is responsible for your state, state changes and side effects. You can use whatever to convert your state into a UI for your users.

From this point you are hopefully able to start exploring on your own. Continue looking into more advanced concepts and guides. You can also complete the full tutorial by watching the [next video chapters]().
