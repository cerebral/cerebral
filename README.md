# Cerebral
A state controller with its own debugger

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![bitHound Score][bithound-image]][bithound-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]
[![js-standard-style][standard-image]][standard-url]
[![Discord][discord-image]][discord-url]

<img src="images/logo.png" width="300" align="center">

## Please head over to our website
[http://www.cerebraljs.com/](http://www.cerebraljs.com/). You will find all the information you need there.

## Verison 2 API

### Controller
```js
import {Controller} from 'cerebral'

const controller = Controller({
  state: {},
  signals: {},
  modules: {}
})
```

### Module
```js
import {Controller} from 'cerebral'

const moduleA = module => ({
  state: {},
  signals: {},
  modules: {}
})

const controller = Controller({
  modules: {
    moduleA: moduleA
  }
})
```

### Render
```js
import React from 'react'
import {render} from 'react-dom'
import {Container, connect} from 'cerebral/react'
import {Controller} from 'cerebral'

const controller = Controller({})
const App = connect({
  foo: 'foo'
}, {
  clicked: 'clicked'
}, function App(props) {
  ...
})

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

### Devtools
```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: Devtools({
    timeTravel: false // Activates time travel feature in debugger
  })
})
```

### Router
```js
import {Controller} from 'cerebral'
import Router from 'cerebral/router'

const controller = Controller({
  router: Router({
    query: false, // Add query support
    onlyHash: false, // Only handle hash urls
    baseUrl: '/' // Base url to handle routes on
  })
})
```

The router activates the possibility to define routes on controller and its modules.

```js
import {Controller} from 'cerebral'
import Router from 'cerebral/router'

const moduleA = module => ({
  routes: {
    '/': 'routed' // Will be /moduleA/
  },
  signals: {
    routed: []
  }
})

const controller = Controller({
  router: Router(),
  routes: {
    '/' 'routed'
  },
  signals: {
    routed: []
  },
  modules: {
    moduleA: moduleA
  }
})
```

### Operators
Operators are available on:

```js
import {set, copy} from 'cerebral/operators'
```

Look in folder for available operators

[npm-image]: https://img.shields.io/npm/v/cerebral.svg?style=flat
[npm-url]: https://npmjs.org/package/cerebral
[travis-image]: https://img.shields.io/travis/cerebral/cerebral.svg?style=flat
[travis-url]: https://travis-ci.org/cerebral/cerebral
[codecov-image]: https://img.shields.io/codecov/c/github/cerebral/cerebral/master.svg?maxAge=2592000?style=flat-square
[codecov-url]: https://codecov.io/gh/cerebral/cerebral
[bithound-image]: https://www.bithound.io/github/cerebral/cerebral/badges/score.svg
[bithound-url]: https://www.bithound.io/github/cerebral/cerebral
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[discord-image]: https://img.shields.io/badge/discord-join%20chat-blue.svg
[discord-url]: https://discord.gg/0kIweV4bd2bwwsvH
