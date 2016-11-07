import {ensurePath} from '../utils'

export default (View) => {
  class Container extends View.Component {
    constructor (props) {
      super(props)
      this.registerComponent = (
        props.controller
        ? this.registerComponent.bind(this)
        : () => {}
      )
      this.unregisterComponent = (
        props.controller
        ? this.unregisterComponent.bind(this)
        : () => {}
      )
      this.updateComponent = (
        props.controller
        ? this.updateComponent.bind(this)
        : () => {}
      )
    }
    getChildContext () {
      const controller = (
        this.props.controller ||
        this.createDummyController(this.props.state)
      )
      return {
        cerebral: {
          controller: controller,
          registerComponent: this.registerComponent,
          unregisterComponent: this.unregisterComponent,
          updateComponent: this.updateComponent
        }
      }
    }
    hasDevtools () {
      return Boolean(this.props.controller && this.props.controller.devtools)
    }
    /*
      When testing and running on the server there is no need to
      initialize all of Cerebral. So by not passing a controller
      to this Container it will create a dummy version which inserts
      state and mocks any signals when connecting the component.
    */
    createDummyController (state = {}) {
      return {
        options: {},
        on () {},
        getState (path) {
          return ensurePath(path).reduce((currentState, pathKey) => {
            return currentState[pathKey]
          }, state)
        },
        getSignal () {
          return () => {}
        }
      }
    }
    registerComponent (component, depsMap) {
      this.props.controller.componentDependencyStore.addEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.props.controller.devtools.updateComponentsMap(component, depsMap)
      }
    }
    unregisterComponent (component, depsMap) {
      this.props.controller.componentDependencyStore.removeEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.props.controller.devtools.updateComponentsMap(component, null, depsMap)
      }
    }
    updateComponent (component, prevDepsMap, depsMap) {
      this.props.controller.componentDependencyStore.removeEntity(component, prevDepsMap)
      this.props.controller.componentDependencyStore.addEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.props.controller.devtools.updateComponentsMap(component, depsMap, prevDepsMap)
      }
      component._update()
    }
    render () {
      return this.props.children
    }
  }

  if (View.PropTypes) {
    Container.propTypes = {
      controller: View.PropTypes.object,
      children: View.PropTypes.node.isRequired
    }
    Container.childContextTypes = {
      cerebral: View.PropTypes.object.isRequired
    }
  }

  return Container
}
