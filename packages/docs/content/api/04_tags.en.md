---
title: Tags
---

## Tags
Tags allows you to target things in Cerebral. They are based on [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). They can be used by **operators**, **connect** and **computed**. Some of them can also be used with other Cerebral modules. The great thing about tags is their composability. For example:

```js
state`items.${state`currentItemKey`}`

state`items.${input`itemKey`}`
```

This allows you to express signals and component dependencies a lot more effectively.

### State
#### Operators
```js
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default [
  set(state`foo.bar`, 'baz')  
]
```
#### Connect
```js
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  foo: state`foo`
},
  function MyComponent() {}
)
```
#### Computed
```js
import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  foo: state`foo`
}, (props) => {})
```

### Input
#### Operators
```js
import {state, input} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default [
  set(state`foo.bar`, input`bar`)  
]
```

### Signal
#### Connect
```js
import {connect} from 'cerebral/react'
import {signal} from 'cerebral/tags'

export default connect({
  buttonClicked: signal`app.buttonClicked`
},
  function MyComponent() {}
)
```

### Props
#### Connect
```js
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'

export default connect({
  item: state`app.items${props`itemKey`}`
},
  function MyComponent() {}
)
```
#### Computed
```js
import {Computed} from 'cerebral'
import {state, props} from 'cerebral/tags'

export default Computed({
  item: state`app.items${props`itemKey`}`
}, (props) => {})
```
### String
#### Operators
```js
import {string, state} from 'cerebral/tags'
import showMessage from '../factories/showMessage'

export default [
  showMessage(string`Hi there ${state`app.user.name`}!`)
]
```
