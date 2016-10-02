---
title: Signals
---

## Signals

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

A convention is to attach chains to signals. These chains typically have their own folder:

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

The actions will also have their own folder.

*src/actions/getData.js*
```js
function getData({axios, path}) {
  return axios.get('/data')
    .then(response => path.success({result: response.data}))
    .catch(error => path.error({error: error.response.data}))
}

export default getData
```
