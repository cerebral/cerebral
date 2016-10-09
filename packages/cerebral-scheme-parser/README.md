# cerebral-scheme-parser
The scheme parser for operators

```js
import schemeParser from 'cerebral-scheme-parser'

const string = 'state:foo.{{input:id}}.{{state:foo.bar}}'
const parsed = schemeParser(string)

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

You can also do it async:

```js
import schemeParser from 'cerebral-scheme-parser'

const string = 'state:foo.{{input:id}}'
const parsed = schemeParser(string)

parsed.getValuePromise(function (scheme) {
  scheme.target // "input"
  scheme.value // "id"
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve('bar')
    }, 100)
  })
})
  .then(function (value) {
    value // "foo.bar"
  })
```

### What about no match?
You can parse normal strings as well.

```js
import schemeParser from 'cerebral-scheme-parser'

const string = 'no target {{input:id}}'
const parsed = schemeParser(string)

parsed.target // null
parsed.value = // no target {{input:id}}

const newString = parsed.getValue(function (scheme) {
  if (scheme.target === 'input') {
    return 'woop'
  }

  return 'wuuut?'
})

newString // no target woop
```
