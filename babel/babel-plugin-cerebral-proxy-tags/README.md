babel-plugin-cerebral-proxy-tags
=========================

In Cerebral v2 tags are a way to target input, state, props or signals. They are
implemented using a new ES2015 feature called [template tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals).

I implemented these using [Proxy Object](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) in [cerebral-proxy-tags](https://github.com/FWeinb/cerebral-proxy-tags). This babel-plugin is tracking the usage of these specific proxy tags and translates them into the tagged template syntax.

## Usage

Instead of this way:

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo.bar`, 'baz')
]
```

You can write the same like shown below and it will get transpiled automatically.

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral-proxy-tags' // or 'cerebral/proxies'

export default [
  set(state.foo.bar, 'baz') // <-- usage
]
```
