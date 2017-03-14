# cerebral-provider-storage

## install
`npm install cerebral-provider-storage@next --save --save-exact`

## description
This module exposes local storage as a provider, where it by default parses and serializes to JSON.

## API

### instantiate

```js
import {Controller} from 'cerebral'
import StorageProvider from 'cerebral-provider-storage'

const controller = Controller({
  providers: [StorageProvider({
    // default, "sessionStorage" is alternative
    target: 'localStorage'
    // Serializes and parses to JSON by default
    json: true,
    // Synchronize state when it changes
    sync: {
      'someStorageKey': 'some.state.path'
    },
    // Set prefix for storagekey "somePrefix.someStorageKey"
    prefix: 'somePrefix'
  })]
})
```

### set
Write data to local storage.

*action*
```javascript
function someAction({storage}) {
  storage.set('someKey', {foo: 'bar'})
}
```

*factory*
```javascript
import {state, props} from 'cerebral/tags'
import {setStorage} from 'cerebral-provider-storage/operators'

export default [
  setStorage(state`currentStorageKey`, props`someData`)
]
```

### get
Get data from local storage.

*action*
```javascript
function someAction({storage}) {
  const data = storage.get('someKey')
}
```

*factory*
```javascript
import {state, props} from 'cerebral/tags'
import {getStorage} from 'cerebral-provider-storage/operators'

export default [
  getStorage('someKey'),
  function someAction ({props}) {
    props.value // Whatever was on "someKey"
  }
]
```
