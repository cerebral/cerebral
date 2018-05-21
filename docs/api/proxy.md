# Proxy

The proxies exposed by Cerebral allows you to target state, sequences, computed and props. They require the [babel-plugin-cerebral](https://www.npmjs.com/package/babel-plugin-cerebral) which transforms the proxies into [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals).


## State

```js
import { state } from 'proxy'

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
Computed({
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
import { sequences } from 'proxy'

// In action
function myAction ({ get }) {
  const mySequence = get(sequences.mySequence)
}

// In factories
[
  httpPost('/items', props.item, {
    onProgress: sequences.updateUploadProgress
  })
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

## Computed

```js
import { computed } from 'proxy'

// In action
function myAction ({ get }) {
  const someValue = get(computed.someValue)
}

// In factories
[
  when(computed.appIsAwesome)
]

// In computed
Computed({
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
import { props } from 'proxy'

// In factories
[
  when(props.isCool)
]

// In computed
Computed({
  foo: props.foo
}, ({ foo }) => {})

// In connect
connect({
  item: state.items[props.index]
}, ...)
```

## ModuleState

```js
import { moduleState } from 'proxy'

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
Computed({
  foo: moduleState.foo
}, () => {})

// In reaction
Reaction({
  foo: moduleState.foo
}, () => {})
```

## ModuleSequences

```js
import { moduleSequences } from 'proxy'

// In action
function myAction ({ get }) {
  const mySequence = get(moduleSequences.mySequence)
}

// In factories
[
  httpPost('/items', props.item, {
    onProgress: moduleSequences.updateUploadProgress
  })
]

// In reaction
Reaction({
  foo: state.foo
}, ({ foo, get }) => {
  get(moduleSequences.mySequence)({ foo })
})
```

## ModuleComputed

```js
import { moduleComputed } from 'proxy'

// In action
function myAction ({ get }) {
  const someValue = get(moduleComputed.someValue)
}

// In factories
[
  when(moduleComputed.appIsAwesome)
]

// In computed
Computed({
  foo: moduleComputed.foo
}, ({ foo }) => {})

// In reaction
Reaction({
  foo: moduleComputed.foo
}, ({ foo }) => {})
```

## String

The string can not e converted to a proxy cause it represents a string, but you can combine it with proxies:

```js
import { string } from 'cerebral/tags'
import { state } from 'cerebral/proxy'

// In factories
[
  httpGet(string`/items/${state.currentItemId}`)
]
```