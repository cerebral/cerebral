# Proxy vs Tags

Cerebral offers two ways to target state, sequences, and props in your application:

1. **Proxies**: A cleaner syntax that looks like normal object access (`state.foo`)
2. **Tags**: Traditional template literals (`state\`foo\``) that work without additional configuration

## Proxies

Proxies provide a more natural syntax for accessing paths in your state and sequences. They require the [babel-plugin-cerebral](https://www.npmjs.com/package/babel-plugin-cerebral) which transforms them into template literal tags behind the scenes.

```marksy
<Info>
The proxy syntax is recommended for most applications as it's more readable and integrates better with TypeScript. Tags are still supported for compatibility and for projects that don't use Babel.
</Info>
```

### Setup for Proxies

1. Install the babel plugin:

   ```sh
   npm install --save-dev babel-plugin-cerebral
   ```

2. Add it to your Babel configuration:

   ```json
   {
     "plugins": ["cerebral"]
   }
   ```

## When to Use Which Approach

- **Use Tags**: When you want to quickly get started without additional configuration or if you're not using Babel
- **Use Proxies**: When you prefer the cleaner syntax or need full TypeScript support

## State

```js
import { state } from 'cerebral'

// In action
function myAction ({ store }) {
  store.set(state.foo, 'bar')
}

// Using tags (alternative without babel plugin)
function myAction ({ store }) {
  store.set(state`foo`, 'bar')
}

// In factories
[
  set(state.foo, 'bar'),
  when(state.isAwesome)
]

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

// Using tags (alternative without babel plugin)
function myAction ({ get }) {
  const mySequence = get(sequences`mySequence`)
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

## Computed

```js
import { state } from 'cerebral'

// Define a computed
export const filteredItems = (get) => {
  const items = get(state.items)
  const filter = get(state.filter)

  return items.filter(item => item[filter.property] === filter.value)
}

// In action
function myAction({ get }) {
  const filteredResult = get(state.filteredItems)
}

// In factories
[
  when(state.appIsAwesome)
]

// In reaction
Reaction({
  foo: state.foo
}, ({ foo }) => {})

// Using tags (alternative without babel plugin)
export const filteredItems = (get) => {
  const items = get(state`items`)
  const filter = get(state`filter`)

  return items.filter(item => item[filter.property] === filter.value)
}

function myAction({ get }) {
  const filteredResult = get(state`filteredItems`)
}

// In components
connect({
  items: state.filteredItems
}, ...)
```

## Props

```js
import { props } from 'cerebral'

// In factories
[
  when(props.isCool)
]

// Using tags (alternative without babel plugin)
[
  when(props`isCool`)
]

// In connect
connect({
  item: state.items[props.index]
}, ...)
```

## ModuleState

```js
import { moduleState } from 'cerebral'

// In action
function myAction({ store }) {
  store.set(moduleState.foo, 'bar')
}

// Using tags (alternative without babel plugin)
function myAction({ store }) {
  store.set(moduleState`foo`, 'bar')
}

// In factories
;[set(moduleState.foo, 'bar'), when(moduleState.isAwesome)]

// In reaction
Reaction(
  {
    foo: moduleState.foo
  },
  () => {}
)
```

## ModuleSequences

```js
import { moduleSequences } from 'cerebral'

// In action
function myAction({ get }) {
  const mySequence = get(moduleSequences.mySequence)
}

// Using tags (alternative without babel plugin)
function myAction({ get }) {
  const mySequence = get(moduleSequences`mySequence`)
}

// In factories
;[onMessage('some_channel', moduleSequences.onMessage)]

// In reaction
Reaction(
  {
    foo: state.foo
  },
  ({ foo, get }) => {
    get(moduleSequences.mySequence)({ foo })
  }
)
```

## Reaction

```js
import { state } from 'cerebral'

// Create a reaction with proxies
const dispose = Reaction(
  {
    items: state.items,
    filter: state.filter
  },
  ({ items, filter, get }) => {
    console.log(
      'Filtered items:',
      items.filter((item) => item.type === filter)
    )

    // Use get to access additional state
    const count = get(state.itemCount)
  }
)

// Using tags (alternative without babel plugin)
const dispose = Reaction(
  {
    items: state`items`,
    filter: state`filter`
  },
  ({ items, filter, get }) => {
    console.log(
      'Filtered items:',
      items.filter((item) => item.type === filter)
    )

    // Use get to access additional state
    const count = get(state`itemCount`)
  }
)

// In components - no change needed as props.reaction is provided
```

## String

```js
import { state, string } from 'cerebral'

// In factories
;[httpGet(string`/items/${state.currentItemId}`)][
  // Using tags (alternative without babel plugin)
  httpGet(string`/items/${state`currentItemId`}`)
]
```

## TypeScript Support

For complete TypeScript support, you need to use proxies. The tags approach doesn't provide the same level of type checking. See [TypeScript documentation](/docs/advanced/typescript) for details on setting up static typing with Cerebral.
