# Tags
Tags allows you to target things in Cerebral. They are based on [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). They can be used by **operators**, **connect** and **compute**. Some of them can also be used with other Cerebral modules. The great thing about tags is their composability. For example:

```js
import {state, props} from 'cerebral/tags'

state`items.${state`currentItemKey`}`

state`items.${props`itemKey`}`
```

This allows you to express signals and component dependencies a lot more effectively. There are 4 tags in Cerebral.

- **state** - Used in signals and connect to target state
- **props** - Used in signals to target payload and in connect to target component props
- **signal** - Used in signals and connect to target a signal
- **string** - Used in signals to evaluate a composed string
