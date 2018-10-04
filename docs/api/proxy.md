# Proxy

The proxies exposed by Cerebral allows you to target state, sequences and props. They require the [babel-plugin-cerebral](https://www.npmjs.com/package/babel-plugin-cerebral) which transforms the proxies into [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals).


## State

```js
import { state } from 'cerebral'

// In action
function myAction ({ store }) {
  store.set(state.foo, 'bar')
}

// In factories
[
  set(state.foo, 'bar'),
  when(state.isAwesome)
]

// In computed
Compute({
  foo: state.foo
}, () => {})

// In reaction
Reaction({
  foo: state.foo
}, () => {})

// In connect
connect({
  foo: state.foo
}, ...)
```

## Sequences

```js
import { sequences } from 'cerebral'

// In action
function myAction ({ get }) {
  const mySequence = get(sequences.mySequence)
}

// In factories
[
  onMessage('some_channel', sequences.onMessage)
]

// In reaction
Reaction({
  foo: state.foo
}, ({ foo, get }) => {
  get(sequences.mySequence)({ foo })
})

// In connect
connect({
  foo: state.foo,
  onClick: sequences.doThis
}, ...)
```

## Compute

```js
import { computed } from 'cerebral'

// In action
function myAction ({ get }) {
  const someValue = get(computed.someValue)
}

// In factories
[
  when(computed.appIsAwesome)
]

// In computed
Compute({
  foo: computed.foo
}, ({ foo }) => {})

// In reaction
Reaction({
  foo: computed.foo
}, ({ foo }) => {})

// In connect
connect({
  foo: computed.foo
}, ...)
```

## Props

```js
import { props } from 'cerebral'

// In factories
[
  when(props.isCool)
]

// In computed
Compute({
  foo: props.foo
}, ({ foo }) => {})

// In connect
connect({
  item: state.items[props.index]
}, ...)
```

## ModuleState

```js
import { moduleState } from 'cerebral'

// In action
function myAction ({ store }) {
  store.set(moduleState.foo, 'bar')
}

// In factories
[
  set(moduleState.foo, 'bar'),
  when(moduleState.isAwesome)
]

// In computed
Compute({
  foo: moduleState.foo
}, () => {})

// In reaction
Reaction({
  foo: moduleState.foo
}, () => {})
```

## ModuleSequences

```js
import { moduleSequences } from 'cerebral'

// In action
function myAction ({ get }) {
  const mySequence = get(moduleSequences.mySequence)
}

// In factories
[
  onMessage('some_channel', moduleSequences.onMessage)
]

// In reaction
Reaction({
  foo: state.foo
}, ({ foo, get }) => {
  get(moduleSequences.mySequence)({ foo })
})
```

## String

The string can not e converted to a proxy cause it represents a string, but you can combine it with proxies:

```js
import { state, string } from 'cerebral'

// In factories
[
  httpGet(string`/items/${state.currentItemId}`)
]
```