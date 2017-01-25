# Server side

"Can I use Cerebral on the server?". Yes, technically you can, but you actually should not. Cerebral is a framework for building applications with user interfaces. Running code related to talking to a server on the server does not really make sense. What does make sense though is pre-rendering and handle complex flows on server side logic.

## Pre-rendering
Both [react](https://facebook.github.io/react/) and [inferno](https://github.com/trueadm/inferno) supports rendering your application on the server. But that does not mean your application runs on the server. The only thing you need to pre-render your application is state. The **StateContainer** allows you to render your application by just passing an object as the state of your app:

```js
import {StateContainer} from 'cerebral/react'
import {renderToString} from 'react-dom/server'

const html = renderToString(
  <StateContainer state={someServerCreatedState}>
    <App />
  </StateContainer>
)
```

Instead of passing the Cerebral controller to the container, you just pass it the state of the application. This will render your application in the correct state. How you produce this state is up to you though. Applications are very different related to producing state on the server so there is not "one answer" here.

It might be a good idea to define the state of your application in one file, instead of using modules:

```js
export default {
  app: {},
  posts: {}
}
```

This way you can import the same state file on your client and on the server. On the server you just populate the missing state.

## Business logic
You might also be tempted to use Cerebral to handle server side business logic. But Cerebral is actually a small wrapper around [function-tree](https://github.com/cerebral/function-tree). Function-tree has its own debugger and gives you more flexibility in handling complexities on the server as well.
