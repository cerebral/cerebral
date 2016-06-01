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

## Testing new version

Add

- `https://github.com/cerebral/cerebral.git#state-tree`
- `https://github.com/cerebral/cerebral-view-react.git#state-tree`

in `package.json` and install deps.

Everything should actually just work with a couple of minor tweaks:

### Instantiate
```js
import { Controller } from 'cerebral';
import Model from 'cerebral-model-immutable';

const controller = Controller(Model({}));
```

### Computed
```js
// Old
function (get) {
  var someState = get('some.state')
}

// New
import { Computed } from 'cerebral';

Computed({
  someState: 'some.state'
}, state => {
  state.someState
})
```

Computed are more explicit now.

### connect

```js
import { connect } from 'cerebral-view-react';

connect({
  foo: 'some.state'
}, Component)
```

Okay, happy testing! :)

## Please head over to our website
[http://www.cerebraljs.com/](http://www.cerebraljs.com/). You will find all the information you need there.

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
