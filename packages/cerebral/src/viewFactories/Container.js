import {throwError, noop} from '../utils'

export default (View) => {
  class Container extends View.Component {
    getChildContext () {
      const {controller} = this.props
      if (!controller) {
        throwError('You are not passing controller to Container')
      }
      const {componentDependencyStore, devtools = noop} = controller
      return {
        cerebral: {
          controller: controller,
          registerComponent: registerComponent.bind(this, componentDependencyStore, devtools),
          unregisterComponent: unregisterComponent.bind(this, componentDependencyStore, devtools),
          updateComponent: updateComponent.bind(this, componentDependencyStore, devtools)
        }
      }
    }
    render () {
      return this.props.children
    }
  }

  if (View.PropTypes) {
    Container.propTypes = {
      controller: View.PropTypes.object.isRequired,
      children: View.PropTypes.node.isRequired
    }
    Container.childContextTypes = {
      cerebral: View.PropTypes.object.isRequired
    }
  }

  return Container
}

function registerComponent (componentDependencyStore, devtools, component, depsMap) {
  componentDependencyStore.addEntity(component, depsMap)
  if (devtools) {
    devtools.updateComponentsMap(component, depsMap)
  }
}

function unregisterComponent (componentDependencyStore, devtools, component, depsMap) {
  componentDependencyStore.removeEntity(component, depsMap)
  if (devtools) {
    devtools.updateComponentsMap(component, null, depsMap)
  }
}

function updateComponent (componentDependencyStore, devtools, component, prevDepsMap, depsMap) {
  componentDependencyStore.updateEntity(component, prevDepsMap, depsMap)
  if (devtools) {
    devtools.updateComponentsMap(component, depsMap, prevDepsMap)
  }
}
