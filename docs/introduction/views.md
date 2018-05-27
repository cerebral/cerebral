# Views

There are several views you can connect Cerebral to and it is mostly a matter of preference. Let us look at a couple of examples.

Vue is out first, [Vue](https://vuejs.org/):

`npm install vue @cerebral/vue`

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import Vue from 'vue/dist/vue'
import { Container, connect } from '@cerebral/vue'
import AppComponent from './components/App'
import main from './main'

const app = App(main, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})

const loadItemsPage = app.get(sequences.loadItemsPage)

loadItemsPage()

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
    posts: state.posts,
    isLoadingItems: state.isLoadingItems,
    openUserModal: sequences.openUserModal
  },
  {
    template: `
  <div v-if="isLoadingItems" className="content">
    <h4>Loading posts...</h4>
  </div>
  <div v-else className="content">
    <div className="posts">
      <div
        v-for="post in posts"
        className="post"
        v-on:click="openUserModal({ id: post.userId })"
      >
        {{ post.title }}
      </div>
    </div>
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

You would of course be able to use **.vue** files as well here. Read more about that in [@cerebral/vue](/views/vue.html).

The tutorial will continue using [React](https://reactjs.org/) though. Run the following command in the terminal:

`npm install react react-dom @cerebral/react`

And reset the **index.html** file to:

```html
<div id="app"></div>
```

And then in the root **index.js** file you can add:

```js
import App from 'cerebral'
import Devtools from 'cerebral/devtools'
import React from 'react'
import { render } from 'react-dom'
import { Container } from '@cerebral/react'
import AppComponent from './components/AppComponent'
import main from './main'

const app = App(main, {
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

And your **App** component located in `src/components/App.js` could look like:

```js
import React from 'react'
import { state, sequences } from 'cerebral/proxy'
import { connect } from '@cerebral/react'

export default connect(
  {
    posts: state.posts,
    openUserModal: sequences.openUserModal
  },
  function App({ posts, openUserModal }) {
    return (
      <div className="posts">
        {posts.map(post => (
          <div
            className="post"
            onClick={() => openUserModal({ id: post.userId })}
          >
            {post.title}
          </div>
        ))}
      </div>
    )
  }
)
```

The point is that for Cerebral it does not really matter. Cerebral is responsible for your state, state changes and side effects. You can use whatever to convert your state into a UI for your users.

From this point you are hopefully able to start exploring on your own. Continue looking into more advanced concepts and guides. You can also complete the full tutorial by watching the [next video chapters]().
