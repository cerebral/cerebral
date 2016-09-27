---
title: Update state
---

## Update state

Defining state and user interfaces is more about describing how something should look, rather than how it should update. Updates is the tricky part, this is where we usually introduce complexity in our application. Cerebral allows you to describe updates the same way you describe state and user interfaces. We call them **signals** and they will help you handle complexity both in code and in your head, trying to reason about how your application works.

```js
import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import {set} from 'cerebral/operators'

const controller = Controller({
  state: {
    title: 'Hello Cerebral!'
  },
  signals: {
    inputChanged: [
      set('state:title', 'input:title')
    ]
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

We now defined a signal named **inputChanged**. The signal tells us "what happened to make this signal run". A signal is defined using a chain, which is basically an array of functions. What we want to happen when this signal triggers is to update the **title** in our model with the value of the input. That is why we **set** it using a Cerebral operator. Calling set will create an action for us that will copy the value of the input to the model. We will learn more about these operators, actions, chains and signals later.

Now let us create the input.

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  title: 'title'
}, {
  inputChanged: 'inputChanged'
},
  function App({title, inputChanged}) {
    return (
      <div>
        <h1>{title}</h1>
        <input
          value={title}
          onChange={(event) => inputChanged({value: event.target.value})}
          />
      </div>
    )
  }
)
```

We told Cerebral that our component is also interested in our newly defined signal, **inputChanged**. This is also exposed on the props. The input we defined uses the same title state as the header above and when it changes it triggers the signal passing in the value of the input.

When you now refresh your application you should be able to change the input and you will also see the header change with it. More interestingly though is that you will see the debugger list every execution of a signal, with information about what happened. This is also a tool the Cerebral debugger provides to give you insight into your application.

Try double clicking a previous signal. Did you see your application go back in time? When gone back in time no signals can be triggered, so be sure that you travel back to the future before trying to change the input again.
