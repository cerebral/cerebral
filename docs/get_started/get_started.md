# Cerebral

> Welcome to the BETA

The **Cerebral 2.0** project is now officially in Beta. It is already running in production on the [webpackbin](https://www.webpackbin.com) project and other non open source projects. A release article, comparing Cerebral to Mobx and Redux, can be [read here](http://www.christianalfoni.com/articles/2017_03_19_Cerebral-2). Have fun looking through the docs and the tutorial, and please let us know if you need any help or have questions. Our community is hanging out on [Discord](https://discord.gg/0kIweV4bd2bwwsvH).

<Youtube url="https://www.youtube.com/embed/uhuLxs8-zP4" />

## Install
To install Cerebral you need to use the Node Package Manager. NPM is part of [Node](https://nodejs.org/en/), so please install that on your computer first. You should install Node version 5 or later. If you are not familiar with Node and/or Webpack it can be a good idea to start out with [the tutorial](/docs/introduction/state.html#tutorial).

To install Cerebral BETA you have to explicitly install Cerebral and its dependency:

**NPM**

`npm install cerebral@beta --save`

**YARN**

`yarn add cerebral@beta`


## Choosing a view type
Cerebral technically can use any view layer. Currently it officially supports [React](https://facebook.github.io/react/) and [Inferno](http://infernojs.org/). From a Cerebral perspective they have the exact same API, you just have to choose to import from **cerebral/react** or **cerebral/inferno**. For specific API differences of the two view libraries please check their documentation.

Choose React if you want a huge ecosystem of shared components and documentation. Inferno is faster than React and is recommended to be used when you do not depend heavily on 3rd party components.

**NPM**

`npm install react react-dom babel-preset-react --save`

`npm install inferno inferno-component babel-plugin-inferno --save`

**YARN**

`yarn add react react-dom babel-preset-react`

`yarn add inferno inferno-component babel-plugin-inferno`

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

## Swag store
You might get to the point where a Cerebral coffee cup at work, a Cerebral t-shirt going to a conference or a Cerebral notebook seems like fun... head over to [the swag store](https://cerebral.threadless.com/). It also brings some income to the Cerebral organization which will be spent on getting people together :-)
