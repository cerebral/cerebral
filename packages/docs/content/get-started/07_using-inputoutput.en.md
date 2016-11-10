---
title: Input and custom Actions 
---

## 7: Input and custom Actions 

`npm run ch06`

Signals can take an input-object which then can be further processed by its actions.
Let us say you have an user input which should get written to state.
As we know now, the only correct way to write to state is to use **Signals**.
To add another concept at this stage we also introduce custom **Actions** which can be used inside a signal. Those actions can make use of the input-object as well. Any returned object will be propagated to the next action.
So let us have a look at a sample Signal which contains a chain like that:
```js
saveButtonClicked: [
      set(state`originalValue`, input`value`),
      myAction1,
      myAction2,
      set(state`extendedValue`, input`value`),
      set(state`toast.message`, input`value`),
      wait(8000),
      set(state`toast.message`, '')
    ]```
We would like to access the input-object from within our action.
So lets have a look at such a sample action:
```js
function myAction1 ({input}) {
  return {
    value: input.value + ' extended by myAction1'
  }
}
```
As you can see actions can receive some context if they want. In this case we are interested in the input object. You could also use ```function myAction1(context)``` to get the full context if needed.
All we do here is to add a text to the existing value and return it back to the next action which then can consume it.

Let us create a working sample inside our app using a few *Actions*. First we need to change the *src/index.js* to this:

```js
import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import App from './components/App'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'
import { set, wait, state, input } from 'cerebral/operators'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    appTitle: 'Cerebral Tutorial App',
    toast: {
      message: 'no message yet'
    },
    originalValue: '',
    extendedValue: ''
  },
  signals: {
    buttonClicked: [
      set(state`toast.message`, 'Button Clicked!'),
      wait(4000),
      set(state`toast.message`, '')
    ],
      saveButtonClicked: [
      set(state`originalValue`, input`value`),
      myAction1,
      myAction2,
      set(state`extendedValue`, input`value`),
      set(state`toast.message`, input`value`),
      wait(8000),
      set(state`toast.message`, '')
    ]  }
})

function myAction1({input}) {
  return {
    value: input.value + ' extended by myAction1'
  }
}

function myAction2({input}) {
  return ({
    value: input.value + ' and also by myAction2',
    aKeyAddedByMyAction2: 'testvalue'
  })
}

render((
  <Container controller={ controller }>
    <App/>
  </Container>
  ), document.querySelector('#root'))
```

Then we need an Input-Component. Please save this component into *src/components/Input/index.js*

```js
import React from 'react'
import { connect } from 'cerebral/react'
export default connect({
  value: 'originalValue'
}, {
  saveButtonClicked: 'saveButtonClicked'
}, function Input(props) {
  return (
    <div className="c-input-group">
      <div className="o-field">
        <div
             id="value"
             className="c-field"
             contentEditable
             suppressContentEditableWarning>
          { props.value }
        </div>
      </div>
      <button
              onClick={ (event) => props.saveButtonClicked({
                          value: document.getElementById("value").innerText
                        }) }
              className="c-button c-button--brand">
        Save
      </button>
    </div>
  )
}
)
```

Then we add this new Component to our existing Parent App-Component (*./src/components/App/index.js*) as follows:
```js
import React from 'react'
import { connect } from 'cerebral/react'
import HeaderButton from '../HeaderButton'
import Toast from '../Toast'
import Input from '../Input'

export default connect({
  appTitle: 'appTitle'
}, {
}, function App(props) {
  return (
    <div className="o-container o-container--medium">
      <h1 className="u-high">{ props.appTitle }</h1>
      <HeaderButton/>
      <Input/>
      <Toast/>
    </div>
  )
}
)
```
Now we are ready to test drive our changes. Please keep an eye on the **debugger**. You can track now the flow of the input-values between the different actions after they got executed. Keep in mind that the result object from an action will be merged with the input and handed over to the next action.


