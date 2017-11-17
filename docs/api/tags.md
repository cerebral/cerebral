# Tags
Tags allow you to reference things in Cerebral. They are based on [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). They can be used by **operators**, **connect** and **compute**. Some of them can also be used with other Cerebral modules. The great thing about tags is their composability. For example:

```js
import { state, props } from 'cerebral/tags'

state`items.${state`currentItemKey`}`

state`items.${props`itemKey`}`
```

This allows you to express signals and component dependencies more effectively. There are 4 tags in Cerebral.

- **state** - Used in signals and connect to target state
- **module** - Used in signals and connect to target state of the module running the signal
- **props** - Used in signals to target payload and in connect to target component props
- **signal** - Used in signals and connect to target a signal
- **signals** - Used in connect to target all the signals of the specified module
- **string** - Used in signals to evaluate a composed string
