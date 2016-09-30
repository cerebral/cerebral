import DependencyStore from '../DependencyStore'
import {ensurePath} from '../utils'

export default (View) => {
  class Container extends View.Component {
    constructor(props) {
      super(props)
      this.dependencyStore = new DependencyStore()
      this.debuggerComponentsMap = {}
      this.debuggerComponentDetailsId = 1
      this.registerComponent = this.registerComponent.bind(this)
      this.unregisterComponent = this.unregisterComponent.bind(this)
      this.updateComponent = this.updateComponent.bind(this)
      this.onCerebralUpdate = this.onCerebralUpdate.bind(this)
    }
    getChildContext() {
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
    hasDevtools() {
      return Boolean(this.props.controller && this.props.controller.devtools)
    }
    /*
      The container will listen to "flush" events from the controller
      and send an event to debugger about initial registered components
    */
    componentDidMount() {
      this.props.controller && this.props.controller.on('flush', this.onCerebralUpdate)

      if (this.hasDevtools()) {
        const event = new CustomEvent('cerebral2.client.message', {
          detail: JSON.stringify({
            type: 'components',
            data: {
              map: this.debuggerComponentsMap,
              render: {
                components: []
              }
            }
          })
        })
        window.dispatchEvent(event)
      }
    }
    /*
      When testing and running on the server there is no need to
      initialize all of Cerebral. So by not passing a controller
      to this Container it will create a dummy version which inserts
      state and mocks any signals when connecting the component.
    */
    createDummyController(state = {}) {
      return {
        on() {},
        getState(path) {
          return ensurePath(path).reduce((currentState, pathKey) => {
            return currentState[pathKey]
          }, state)
        },
        getSignal() {
          return () => {}
        }
      }
    }
    /*
      The container will listen to "flush" events from the controller
      and send an event to debugger about initial registered components
    */
    extractComponentName(component) {
      return component.constructor.displayName.replace('CerebralWrapping_', '')
    }
    /*
      On "flush" event use changes to extract affected components
      from dependency store and render them
    */
    onCerebralUpdate(changes, force) {
      const componentsToRender = force ? this.dependencyStore.getAllUniqueEntities() : this.dependencyStore.getUniqueEntities(changes)
      const start = Date.now()
      componentsToRender.forEach((component) => {
        if (this.hasDevtools()) {
          component.renderCount = 'renderCount' in component ? component.renderCount + 1 : 1
        }
        component._update()
      })
      const end = Date.now()

      if (this.hasDevtools()) {
        const event = new CustomEvent('cerebral2.client.message', {
          detail: JSON.stringify({
            type: 'components',
            data: {
              map: this.debuggerComponentsMap,
              render: {
                start: start,
                duration: end - start,
                changes: changes,
                components: componentsToRender.map(this.extractComponentName)
              }
            }
          })
        })
        window.dispatchEvent(event)
      }
    }
    registerComponent(component, depsMap) {
      this.dependencyStore.addEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.updateDebuggerComponentsMap(component, depsMap)
      }
    }
    unregisterComponent(component, depsMap) {
      this.dependencyStore.removeEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.updateDebuggerComponentsMap(component, depsMap)
      }
    }
    updateComponent(component, prevDepsMap, depsMap) {
      this.dependencyStore.removeEntity(component, prevDepsMap)
      this.dependencyStore.addEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.updateDebuggerComponentsMap(component, depsMap, prevDepsMap)
      }
      component._update()
    }
    /*
      Updates the map the represents what active state paths and
      components are in your app. Used by the debugger
    */
    updateDebuggerComponentsMap(component, nextDeps, prevDeps) {
      const componentDetails = {
        name: this.extractComponentName(component),
        renderCount: component.renderCount || 1,
        componentDetailsId: component.detailsId || this.componentDetailsId++
      }

      if (prevDeps) {
        for (const depsKey in prevDeps) {
          for (let x = 0; x < prevDeps[depsKey].length; x++) {
            if (prevDeps[depsKey][x].componentDetailsId === component.componentDetailsId) {
              prevDeps[depsKey].splice(x, 1)
              break
            }
          }
        }
      }

      for (const depsKey in nextDeps) {
        this.debuggerComponentsMap[depsKey] = (
          this.debuggerComponentsMap[depsKey] ?
            this.debuggerComponentsMap[depsKey].concat(componentDetails) :
            [componentDetails]
        )
      }
    }
    render() {
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
