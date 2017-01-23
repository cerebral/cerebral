# Modals

Modals are one of those things that are more complex than you might think. So lets start with a simple modal using a module:

*src/modules/app/index.js*
```js
export default {
  state: {
    title: 'My modal demo',
    showMyModal: false
  }
}
```

Either we want to show the modal or we do not. To actually trigger the modal we can create a signal that will toggle the state. To simplify the example we define the chain inside the same file:

```js
import {toggle} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default {
  state: {
    title: 'My modal demo',
    showMyModal: false
  },
  signals: {
    myModalToggled: [
      toggle(state`app.showMyModal`)
    ]
  }
}
```

So in our view we just render the Modal:

```js
import React from 'react'
import {connect} from 'cerebral/react'

import MyModal from './MyModal'

export default connect({
  title: state`app.title`
  myModalToggled: signal`app.myModalToggled`
},
  function App(props) {
    return (
      <div onClick={() => props.myModalToggled()}>
        <h1>{props.title}</h1>
        <MyModal />
      </div>
    )
  }
)
```

So what to take note of here is that we have created a specific modal component for our modal. That means if we want multiple modals in our application each of them will have their own **modal** state and component. That does not mean you have to create the backdrop and modal container for each modal, that is just UI, but you create a specific component for each modal and connect what state it wants directly. Lets look at the modal we just created using React as an example:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'

import ModalContainer from './ModalContainer'

export default connect({
  show: state`app.showMyModal`
  myModalToggled: signal`app.myModalToggled`
},
  function MyModal(props) {
    if (!props.show) {
      return null
    }

    return (
      <ModalContainer onClose={props.myModalToggled}>
        Hello modal!
      </ModalContainer>
    )
  }
)
```

We control the modal from within the component. Either it does not show anything or it will render a **fixed** modal container which allows us to pass in a signal to run when the modal should close.

## Increasing complexity
So let us increase complexity here. What if our modal was a modal to show a user based on a userId? An approach to this is adding a **currentUserId** to state. And instead of having a **modalToggled** kind of signal we have one signal for opening the modal, where we set the passed in *userId*, and an other for closing it:

```js
import {set} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'

export default {
  state: {
    title: 'My modal demo',
    showUserModal: false,
    currentUserKey: null,
    users: {}
  },
  signals: {
    userModalOpened: [
      set(state`app.showUserModal`, true),
      set(state`app.currentUserKey`, input`userKey`)
    ],
    userModalClosed: [
      set(state`app.showUserModal`, false)
    ]
  }
}
```

Now our modal component can grab the user and update separately from the list:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal, props} from 'cerebral/tags'

import ModalContainer from './ModalContainer'

export default connect({
  show: state`app.showMyModal`,
  user: state`app.users.${state`currentUserKey`}`,
  userModalClosed: signal`app.userModalClosed`
},
  function UserModal(props) {
    if (!props.show) {
      return null
    }

    return (
      <ModalContainer onClose={props.userModalClosed}>
        Hello {props.user.name}!
      </ModalContainer>
    )
  }
)
```

What is good about this approach is that you can very easily handle grabbing more information about the user if needed. Lets say we needed to download the user projects when opening the modal:

```js
import {when, set} from 'cerebral/operators'
import {state, input, string} from 'cerebral/tags'
import {httpGet} from 'cerebral-provider-http'

export default {
  state: {
    title: 'My modal demo',
    showUserModal: false,
    currentUserKey: null,
    users: {},
    isLoadingProjects: false
  },
  signals: {
    userModalOpened: [
      set(state`app.showUserModal`, true),
      set(state`app.currentUserKey`, input`userKey`),
      set(state`app.isLoadingProjects`, true),
      set(input`userId`, state`app.users.${input`userKey`}.id`),
      httpGet(string`/users/${input`userId`}/projects`), {
        success: [
          set(state`app.users.${input`userKey`}.projects`, input`result`)
        ],
        error: []
      },
      set(state`app.isLoadingProjects`, false)
    ],
    userModalClosed: [
      set(state`app.showUserModal`, false)
    ]
  }
}
```

This is not Cerebral complexity, this is application complexity and it has to be defined somewhere. We could hide it in an abstraction or we can describe it exactly as it happens so everybody understands, including the debugger!

## Editing the user
So what if we display the user to edit it? Well, we have to take into account that we probably do not want to edit the user directly, we rather want a copy of the data that will later be merged in with the user if we submit it. So instead of pointing to the user, we will copy over the details of the user for edit in our modal. When the modal close, we update the server:

```js
import {when, set} from 'cerebral/operators'
import {state, input, string} from 'cerebral/tags'
import {httpPatch} from 'cerebral-provider-http'

export default {
  state: {
    title: 'My modal demo',
    userModal: {
      show: false,
      fields: {
        firstName: '',
        lastName: ''
      }
    },
    users: {},
    isSavingUser: false
  },
  signals: {
    userModalOpened: [
      set(state`app.userModal.show`, true),
      set(state`app.userModal.fields.firstName`, state`users.${input`userKey`}.firstName`),
      set(state`app.userModal.fields.lastName`, state`users.${input`userKey`}.lastName`)
    ],
    userModalClosed: [
      set(input`userId`, state`app.users.${input`userKey`}.id`),
      set(state`isSavingUser`, true),
      httpPatch(string`/users/${input`userId`}`, state`userModal.fields`), {
        success: [
          set(state`isSavingUser`, false),
          set(state`app.userModal.show`, false)
        ],
        error: []
      }
    ]
  }
}
```

We brought a lot of complexity into this, but that is important as typically this is what you want to do in applications. Modals can also be handled other ways, for example maybe you want an array of named modals which is mounted by a "modal controller component". This pretty much works like you would handle pages with the router, though you rather render multiple modals on top of each other. The important thing here is to see that everything is the same. It does not matter the complexity and customization you want to do, you are completely free to do it however you want.
