# @cerebral/react

[React](https://facebook.github.io/react) view for Cerebral.

## Install

`npm install @cerebral/react react react-dom babel-preset-react`

## Container

```js
import React from 'react'
import { render } from 'react-dom'
import App from 'cerebral'
import { Container } from '@cerebral/react'
import AppComponent from './components/App'
import main from './main'

const app = App(main)

render(
  <Container app={app}>
    <AppComponent />
  </Container>,
  document.querySelector('#app')
)
```

## connect

Typically you add a stateless component:

```js
import React from 'react'
import { state, sequences } from 'cerebral'
import { connect } from '@cerebral/react'

export default connect(
  {
    foo: state`foo`,
    onClick: sequences`onClick`
  },
  function MyComponent({ foo, onClick }) {
    return <div onClick={() => onClick()}>{foo}</div>
  }
)
```

But you can also use stateful components:

```js
import React from 'react'
import { state, sequences } from 'cerebral'
import { connect } from '@cerebral/react'

export default connect(
  {
    foo: state`foo`,
    onClick: sequences`onClick`
  },
  class MyComponent extends React.Component {
    render() {
      return <div onClick={() => this.props.onClick()}>{this.props.foo}</div>
    }
  }
)
```

You do not have to define dependencies right away, you can rather dynamically grab them from inside the component. This is a preference thing:

```js
import React from 'react'
import { state, sequences } from 'cerebral'
import { connect } from '@cerebral/react'

export default connect(
  function MyComponent({ get }) {
    const foo = get(state`foo`)
    const onClick = get(sequences`onClick`)

    return <div onClick={() => onClick()}>{foo}</div>
  }
)
```

You can add an additional function to connect that gives you full control of properties of the component and dependencies. The returned object from this function will be the exact props passed into the component.

```js
import React from 'react'
import { sequences, state } from 'cerebral'
import { connect } from '@cerebral/react'

export default connect(
  {
    foo: state`app.foo`,
    onClick: sequences`app.onClick`
  },
  ({ foo, onClick }, ownProps, get) => {
    return {
      // values from state could be transformed here
      foo: `Label: ${foo}`,
      // sequence calls could be bound here, so component uses it as general callback
      onClick: (e) => onClick({ id: ownProps.id })
    }
  },
  function App({ foo, onClick }) {
    return <div onClick={onClick}>{foo}</div>
  }
)
```

* **dependencyProps** are the props you connected.

* **ownProps** are the props passed into the component by the parent.

* **get** allows you to resolve computed etc., just like get in actions.

## TypeScript

If you use TypeScript, you can type your component props with connect. Read the [advanced section](/docs/advanced/typescript) on how to do this.
