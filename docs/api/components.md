# Components

## React

[React](https://facebook.github.io/react) view for cerebral.

**NPM**

`npm install @cerebral/react react react-dom babel-preset-react`

```js
import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from '@cerebral/react'
import App from './App'

const controller = Controller({
  state: {
    foo: 'bar'
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

```js
import React from 'react'
import {state, signal} from 'cerebral/tags'
import {connect} from '@cerebral/react'

// Stateless
export default connect({
  foo: state`foo`,
  click: signal`clicked`
},
  function MyComponent ({foo, click}) {
    return <div onClick={() => click()}>{foo}</div>
  }
)

// Stateful
export default connect({
  foo: state`foo`,
  click: signal`clicked`
},
  class MyComponent extends React.Component {
    render () {
      return <div onClick={() => this.props.click()}>{this.props.foo}</div>
    }
  }
)
```

You can add an additional function to connect that gives you full control of properties of the component and dependencies. The returned object from this function will be the exact props passed into the component.

```js
import React from 'react'
import {signal, state} from 'cerebral/tags'
import {connect} from '@cerebral/react'

export default connect({
  foo: state`app.foo`,
  clicked: signal`app.somethingClicked`
}, (dependencyProps, ownProps, resolve) => {
  const path = resolve.path(state`entities.foo.{ownProps}`) // we can resolve values or path here. Note: it's not tracked as dependency
  return {
    foo: `Label: ${foo}`,                                   // values from state could be transformed here
    onClick: (e) => clicked({ id: ownProps.id })            // signals calls could be bound here, so component uses it as general callback
  }
},
  function App({foo, onClick}) {
    return <div onClick={onClick}>{foo}</div>
  }
)
```

**dependencyProps** are the props you connected.

**props** are the props passed into the component by the parent.

**resolve** allows you to resolve computed etc., just like resolve in actions.

## TypeScript

If you use TypeScript, you can type your component props with connect:

```ts
import React from 'react'
import {state, signal} from 'cerebral/tags'
import {connect} from '@cerebral/react'

// connected props
interface Props {
  click (): void
  foo: string
}

// component props such as <MyComponent name='foobar' />
interface EProps {
  name: string
}

// Stateless
export default connect<Props, EProps>({
  foo: state`foo`,
  click: signal`clicked`
},
  // TypeScript now knows about foo and click props
  function MyComponent ({foo, click}) {
    return <div onClick={() => click()}>{foo}</div>
  }
)

// Stateful
export default connect<Props, EProps>({
  foo: state`foo`,
  click: signal`clicked`
},
  class MyComponent extends React.Component<Props, EProps> {
    render () {
      return <div onClick={() => this.props.click()}>{this.props.foo}</div>
    }
  }
)
```

## Inferno

[Inferno](http://infernojs.org) view for cerebral.

**NPM**

`npm install @cerebral/inferno inferno inferno-component inferno-create-element babel-plugin-inferno`

```js
import Inferno from 'inferno'
import {Controller} from 'cerebral'
import {Container} from '@cerebral/inferno'
import App from './App'

const controller = Controller({
  state: {
    foo: 'bar'
  }
})

Inferno.render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

```js
import Inferno from 'inferno'
import Component from 'inferno-component'
import {connect} from '@cerebral/inferno'
import {state, signal} from 'cerebral/tags'

// Stateless
export default connect({
  foo: state`foo`,
  click: signal`clicked`
},
  function MyComponent ({foo, click}) {
    return <div onClick={() => click()}>{foo}</div>
  }
)

// Stateful
export default connect({
  foo: state`foo`,
  click: signal`clicked`
},
  class MyComponent extends Component {
    render () {
      return <div onClick={() => this.props.click()}>{this.props.foo}</div>
    }
  }
)
```

## Preact (BETA)

[Preact](https://github.com/developit/preact) view for cerebral.

**NPM**

`npm install @cerebral/preact preact babel-preset-preact`

```js
import {h, render} from 'preact'
import {Controller} from 'cerebral'
import {Container} from '@cerebral/preact'
import App from './App'

const controller = Controller({
  state: {
    foo: 'bar'
  }
})

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
```

```js
import {h, Component} from 'preact'
import {connect} from '@cerebral/preact'
import {state, signal} from 'cerebral/tags'

export default connect({
  foo: state`foo`,
  click: signal`clicked`
},
  class MyComponent extends Component {
    render ({foo, click}) {
      return <div onClick={() => click()}>{foo}</div>
    }
  }
)
```

## Angularjs (BETA)

[Angularjs](https://angularjs.org) view for cerebral.

**NPM**

`npm install @cerebral/angularjs angular`

```js
import angular from 'angular'
import {addModule} from '@cerebral/angularjs'

addModule(angular)

angular.module('app', ['cerebral'])
  .config(function (cerebralProvider) {
    cerebralProvider.configure({
      state: {
        foo: 'bar'
      },

      // Special controller property to expose core
      // angular services to your signals
      services: ['$http', '$timeout']
    })
  })
```

```js
import angular from 'angular'
import {connect} from '@cerebral/angularjs'
import {state, signal} from 'cerebral/tags'

angular.component('myComponent', {
  template: '<div ng-click="click()">{{foo}}</div>',
  controller: connect({
    foo: state`foo`,
    click: signal`clicked`
  }, 'MyComponent', ['cerebral', function MyController (cerebral) {

    // In some cases you might need access to cerebral's controller.
    // You can inject the cerebral angular service and
    // access it's controller property anywhere in your app
    cerebral.controller.getSignal('mySignal')()

    // Optionally add custom behaviour to controller
  }])
})
```
Since angular doesn't expose the component name,
you will need to provide one to `connect` for the
component to be given a name in cerebral.

You can call connect in the following ways:
```js
connect(dependencies)
connect(dependencies, name)
connect(dependencies, controller)
connect(dependencies, name, controller)
```


## Vue (BETA)

[Vue.js](https://vuejs.org) view for cerebral.

**NPM**

`npm install @cerebral/vue vue`

```js
import Vue from 'vue/dist/vue'
import {Controller} from 'cerebral'
import {Container, connect} from '@cerebral/vue'

const controller = Controller({
  state: {
    foo: 'bar'
  }
})

 var app = new Vue({
  el: '#app',
  components: {
    container: Container(controller),
    'my-component': MyComponent
  }
})
```

**Note!** The HTML of the root element must use the *container*:

```html
<div id="app">
  <container>
    <my-component></my-component>
  </container>
</div>
```

```js
import {connect} from '@cerebral/vue'
import {state, signal} from 'cerebral/tags'

export default connect({
  foo: state`foo`,
  click: signal`clicked`
}, {
  template: '<div v-on:click="click()">{{foo}}</div>'
})
```

## Composing dependencies
You can compose your dependencies with other tags. Like collect state based on a property passed to the component. Or maybe grab state based on some other state.
```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state, props} from 'cerebral/tags'

export default connect({
  isLoading: state`${props`module`}.isLoading`
},
  function App(props) {
    props.isLoading
  }
)
```

## Optimize rendering
Due to Cerebrals "render on path change" it is possible to optimize component rendering.

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

export default connect({
  list: state`app.array.*`,
  map: state`app.map.*`,
},
  function App (props) {
    props.list // [0, 1, 2, 3]
    props.map // ['foo', 'bar']
  }
)
```

This component will only render when any keys are added or removed, meaning that nested change to a child does not cause a new render.
