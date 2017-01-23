# Testing

Cerebral makes it easy to test your application components and business logic.

## Components
The **Container** you use to expose Cerebral to your components can also be used when testing, but you can also use the **StateContainer** which allows you to pass state down to your components as if it was extracted from the Cerebral controller.

```js
import React from 'react'
import {mount} from 'enzyme'
import {StateContainer} from 'cerebral/react'

import Foo from './Foo'

describe('<Foo />', () => {
  it('allows us to set props', () => {
    const state = {
      foo: 'bar'
    }
    const wrapper = mount(
      <StateContainer state={state}>
        <Foo />
      </StateContainer>
    )
    expect(wrapper.find('.foo')).to.have.length(1)
  })
})
```

This approach allows you to pass down state wherever you want and ensure the components render as expected.

## Actions
Actions are just functions. You just have to give them what they operate on. It is just like testing pure functions.

Given the action:
```js
function someAction({state, axios, path}) {
  return axios.get(`/user/${state.get('user.id')}`)
    .then((response) => path.success({user: response.data}))
    .catch((error) => path.error({error: error.response.data}))
}
```

You can test it like:

```js
import sinon from 'sinon'
import assert from 'assert'

describe('Something', () => {
  it('should return object with user', (done) => {
    const mockedContext = {
      axios: {get: Promise.resolve({data: {name: 'Arne'}})},
      path: {success: sinon.spy()},
      state: {get() {}}
    }
    someAction(mockedContext).then((result) => {
      assert.ok(mockedContext.path.success.called)
      assert.deepEqual(result, {user: {name: 'Arne'}})
    })
  })
})
```

## Signals
To test signals you need to mock the context for all running actions. Since signals are defined decoupled from what is running them, you can define a new controller where you mock out whatever does side effects.

```js
import sinon from 'sinon'
import assert from 'assert'
import {Controller} from 'cerebral'
import someChain from '../src/chains/someChain'

describe('Something', () => {
  it('should get data', (done) => {
    const controller = Controller({
      state: {
        isLoading: false,
        user: null
      },
      signals: {
        testRun: someChain
      },
      providers: [
        function (context) {
          context.axios = {
            get() {
              assert.ok(controller.getState('isLoading'))

              return Promise.resolve({data: {name: 'Arne'}})
            }
          }

          return context
        }
      ]
    })

    controller.on('signalEnd', () => {
      assert.deepEqual(controller.getState(), {
        isLoading: false,
        user: {name: 'Arne'}
      })
      done()
    })
    controller.getSignal('testRun')()
  })
})
```
