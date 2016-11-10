---
title: Exposing State to the View
---

## 3: Exposing State to the View

`npm run ch02`

Now lets get that state displayed on our webpage.
First of all we need to tell our ViewComponent (HeaderButton) to **connect** to that state. Why is that? Well you'll get the enlightment a few lines further down, just believe and stay with us!

So please change the *src/components/HeaderButton/index.js* to:

```js
import React from 'react'
import { connect } from 'cerebral/react'

export default connect({
  title: 'title'
}, {
}, function HeaderButton(props) {
  return (
    <div>
      <button className="c-button c-button--info c-button--block">
        { props.title }
      </button>
    </div>
  )
}
)
```

And voilà, your webpage should display now the title state as configured.
It's not too much code and don't mind the className too much here, it's just used to spice the button up a little bit. Now what about state changes? How does that work?
Well once again head over to cerebral-debugger. Click into the state then change it and hit enter and you will see the webpage displaying your changed state. Thanks to 
```js
connect({
  title: 'title'
}
```
we told Cerebral that this component is interested in the value on the path **title**, and we wanted it exposed as **title** to our component as well.

Because this component now depends on the **title** state it gets rerendered whenever it changes. A cool fact about that is that there is **no dirty-checking or other value comparing needed**. You will understand this better after you have completed the **Signals** Chapter which is next.

Congratulations, you have now created application state and exposed it to a view layer. You can now translate the state of the application into something a user can understand. You will notice with Cerebral that this is a very clear separation. You define your application state in Cerebral and a view layer of choice will use this state to produce a user interface.
