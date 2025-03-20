# View Integrations

Cerebral can be connected to various view libraries, allowing you to use your preferred UI framework while leveraging Cerebral's state management capabilities. This separation of concerns means Cerebral handles your application state and side effects while the view library handles rendering.

## Available View Integrations

Cerebral provides official integrations with several popular view libraries:

- **React** - `@cerebral/react`
- **Vue** - `@cerebral/vue`
- **Angular** - `@cerebral/angular`
- **Preact** - `@cerebral/preact`
- **Inferno** - `@cerebral/inferno`

All integrations follow a similar pattern for connecting components to Cerebral state and sequences.

## Basic Integration Pattern

Regardless of which view library you choose, the integration follows these steps:

1. Install Cerebral and the view integration package
2. Create a Cerebral app with your main module
3. Connect the app to your view using a Container component
4. Connect individual components to Cerebral state and sequences

## Using Vue

Vue is one of the supported view libraries for Cerebral.

### Installation of @cerebral/vue

```bash
npm install vue @cerebral/vue
```

### Basic Setup with Vue 3

```js
import { createApp } from 'vue'
import App from 'cerebral'
import { Container, connect } from '@cerebral/vue'
import AppComponent from './components/App'
import main from './main'

const app = App(main, {
  devtools:
    process.env.NODE_ENV === 'production'
      ? null
      : Devtools({ host: 'localhost:8585' })
})

const loadItemsPage = app.get(sequences.loadItemsPage)
loadItemsPage()

createApp({
  components: {
    Container: Container(app),
    AppComponent
  },
  template: '<Container><AppComponent /></Container>'
}).mount('#app')
```

### Defining Components

```js
import { connect } from '@cerebral/vue'
import { state, sequences } from 'cerebral'

export default connect(
  {
    posts: state`posts`,
    isLoadingItems: state`isLoadingItems`,
    openUserModal: sequences`openUserModal`
  },
  {
    template: `
  <div v-if="isLoadingItems" class="content">
    <h4>Loading posts...</h4>
  </div>
  <div v-else class="content">
    <div class="posts">
      <div
        v-for="post in posts"
        class="post"
        @click="openUserModal({ id: post.userId })"
      >
        {{ post.title }}
      </div>
    </div>
  </div>
`
  }
)
```

You can also use **.vue** files for your components. Read more about that in [@cerebral/vue](/views/vue.html).

## Using React

React is one of the most popular integrations for Cerebral.

### Installation of @cerebral/react

```bash
npm install react react-dom @cerebral/react
```

### Basic Setup

```js
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'cerebral'
import { Container } from '@cerebral/react'
import Devtools from 'cerebral/devtools'
import AppComponent from './components/App'
import main from './main'

const app = App(main, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})

const root = createRoot(document.querySelector('#app'))
root.render(
  <Container app={app}>
    <AppComponent />
  </Container>
)
```

### Defining Components in React

```js
import React from 'react'
import { state, sequences } from 'cerebral'
import { connect } from '@cerebral/react'

// Function component (recommended)
export default connect(
  {
    posts: state`posts`,
    openUserModal: sequences`openUserModal`
  },
  function App({ posts, openUserModal }) {
    return (
      <div className="posts">
        {posts.map((post) => (
          <div
            key={post.id}
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

// Dynamic dependencies
export const DynamicComponent = connect(function ({ get }) {
  const posts = get(state`posts`)
  const openUserModal = get(sequences`openUserModal`)

  return (
    <div className="posts">
      {posts.map((post) => (
        <div
          key={post.id}
          className="post"
          onClick={() => openUserModal({ id: post.userId })}
        >
          {post.title}
        </div>
      ))}
    </div>
  )
})
```

The point is that for Cerebral it does not really matter. Cerebral is responsible for your state, state changes and side effects. You can use whatever to convert your state into a UI for your users.

From this point you are hopefully able to start exploring on your own. Continue looking into more advanced concepts and guides.
