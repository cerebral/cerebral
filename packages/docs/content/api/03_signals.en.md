---
title: Signals
---

## Signals

Typically you will define the actions used in its own folder.

*src/actions/getData.js*
```js
function getData({axios, path}) {
  return axios.get('/data')
    .then(response => path.success({result: response.data}))
    .catch(error => path.error({error: error.response.data}))
}

export default getData
```

You will also define the chains used in their own folders.

*src/chains/updateData.js*
```js
import getData from '../actions/getData'
import {set, copy} from 'cerebral/operators'

export default [
  set('state:isLoading', true),
  loadData, {
    success: [
      copy('input:result', 'state:data')
    ],
    error: [
      copy('input:error', 'state:error')
    ]
  },
  set('state:isLoading', false)
]
```

Then you define the signal and attach the chain:

```js
import {Controller} from 'cerebral'
import updateData from './chains/updateData'

const controller = Controller({
  state: {
    data: null,
    isLoading: false,
    error: null
  },
  signals: {
    mounted: updateData
  }
})
```
