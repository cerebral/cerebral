---
title: Operators
---

## Operators
Operators are function factories that returns an action. These allows you to do common things like updating state and control the flow.

```js
import {
  set,
  toggle,
  when,
  debounce,
  filter,
  wait
} from 'cerebral/operators'

export default [
  // Set some state
  set('state:foo.bar', true),
  // Set value from input
  set('state:foo.bar', 'input:value')

  // Toggle a boolean value in your state
  toggle('state:foo'),

  // Conditional truthy check
  when('state:foo.isAwesome'), {
    true: [],
    false: []
  },

  // Hold action until 200ms has passed. If signal
  // triggers again within 200ms the previous signal
  // goes down "discarded" path, while new signal holds
  // for 200ms. Typical typeahead functionality
  debounce(200), {
    accepted: [],
    discarded: []
  },
  // Short version, only accepted chain
  ...debounce(200, [])

  // Go down "accepted" when value matches filter
  // or "discarded" when it does not match
  filter('input:foo', function minLength3(value) {
    return value.length >= 3
  }), {
    accepted: [],
    discarded: []
  },
  // Short version, only accepted chain
  ...filter('input:foo', function minLength3(value) {
    return value.length >= 3
  }, []),

  // Wait 200ms, then continue chain
  wait(200)
]
```

#### Inline scheme
The special **state:some.path** is what we call a **scheme**. The first part, **state**, is the target. It is possible to add more targets. For example if you want to update a user name based on the id passed into the signal.

```js
set('state:users.{{input:userId}}.name', 'input:name')
```

### Custom operators
You can use the Cerebral scheme parser when you create your own action factories.

```js
import {parseScheme} from 'cerebral'

const string = 'state:foo.{{input:id}}.{{state:foo.bar}}'
const parsed = parseScheme(string)

parsed.target // "state"
parsed.value = // foo.{{input:id}}.{{state:foo.bar}}

// getValue iterates the inline schemes so this callback
// will be called twice
const newString = parsed.getValue(function (scheme) {
  scheme.target // "input", then "state"
  scheme.value // "id", then "foo.bar"

  if (scheme.target === 'input') {
    return 'woop'
  }

  return 'wuuut?'
})

newString // foo.woop.wuuut?
```

Read more at [cerebral-scheme-parser](https://github.com/cerebral/cerebral-scheme-parser)
