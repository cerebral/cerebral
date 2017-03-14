# Cerebral

To install Cerebral you need to use the Node Package Manager. NPM is part of [Node](https://nodejs.org/en/), so please install that on your computer first. You should install Node version 5 or later. If you are not familiar with Node and/or Webpack it can be a good idea to start out with [the tutorial](/docs/developer_guide/index.html).

To install Cerebral Alpha you have to explicitly install Cerebral and its dependency:

`npm install cerebral@next --save --save-exact`


## Choosing a view type
Cerebral technically can use any view layer. Currently it officially supports [React](https://facebook.github.io/react/) and [Inferno](http://infernojs.org/). From a Cerebral perspective they have the exact same API, you just have to choose to import from **cerebral/react** or **cerebral/inferno**. For specific API differences of the two view libraries please check their documentation.

Choose React if you want a huge ecosystem of shared components and documentation. Inferno is faster than React and is recommended to be used when you do not depend heavily on 3rd party components.

## Hello world
*controller.js*
```js
import {Controller} from 'cerebral'

const controller = Controller({
  state: {
    title: 'Hello world'
  }
})

export default controller
```

*App.js*
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  title: state`title`
},
  function App ({title}) {
    return (
      <h1>{title}</h1>
    )
  }
)
```

*main.js*
```js
import React from 'react'
import {render} from 'react-dom'
import {Container} from 'cerebral/react'
import controller from './controller'
import App from './App'

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```
