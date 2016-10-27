---
title: Server side
---

## Server side

"Can I use Cerebral on the server?". Yes, technically you can, but you actually should not. Cerebral is framework for building applications with user interfaces. Running code related to talking to a server on the server does not really make sense. What does make sense though is pre-rendering and handle complex flows.

### Pre-rendering
Both [react]() and [inferno]() supports rendering your application on the server. But that does not mean your application runs on the server. The only thing you need to pre-render your application is state. The **Container** for your application can also be use don the server to provide state.

```js
import {renderToString} from 'react-dom/server'

const html = renderToString(
  <Container state={someServerCreatedState}>
    <App />
  </Container>
)
```

Instead of passing the Cerebral controller to the container, you just pass it the state of the application. The will render your application in the correct state. How you produce this state is up to you though. Applications are very different related to producing state on the server so there is not "one answer" here.

### Business logic
You might also be tempted to use Cerebral to handle server side business logic. But Cerebral is actually a small wrapper around [function-tree](https://github.com/cerebral/function-tree). Function-tree has its own node debugger and gives you more flexibility in handling complexities on the server as well.
