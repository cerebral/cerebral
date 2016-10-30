/* global CustomEvent */
import DependencyStore from '../DependencyStore'
import {ensurePath} from '../utils'

export default (View) => {
  class Container extends View.Component {
    constructor (props) {
      super(props)
      this.dependencyStore = new DependencyStore()
      this.debuggerComponentsMap = {}
      this.debuggerComponentDetailsId = 1
      this.registerComponent = this.registerComponent.bind(this)
      this.unregisterComponent = this.unregisterComponent.bind(this)
      this.updateComponent = this.updateComponent.bind(this)
      this.onCerebralUpdate = this.onCerebralUpdate.bind(this)
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
      The container will listen to "flush" events from the controller
      and send an event to debugger about initial registered components
    */
    componentDidMount () {
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
    createDummyController (state = {}) {
      return {
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
    /*
      The container will listen to "flush" events from the controller
      and send an event to debugger about initial registered components
    */
    extractComponentName (component) {
      return component.constructor.displayName.replace('CerebralWrapping_', '')
    }
    /*
      On "flush" event use changes to extract affected components
      from dependency store and render them. If debugger is attached
      the current components map is passed with a timeout due to waiting
      for all components to update
    */
    onCerebralUpdate (changes, force) {
      let componentsToRender = []

      if (force) {
        componentsToRender = this.dependencyStore.getAllUniqueEntities()
      } else if (this.props.controller.strictRender) {
        componentsToRender = this.dependencyStore.getStrictUniqueEntities(changes)
      } else {
        componentsToRender = this.dependencyStore.getUniqueEntities(changes)
      }

      const start = Date.now()
      componentsToRender.forEach((component) => {
        if (this.hasDevtools()) {
          this.updateDebuggerComponentsMap(component)
        }
        component._update(force)
      })
      const end = Date.now()

      if (this.hasDevtools() && componentsToRender.length) {
        setTimeout(() => {
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
        }, 50)
      }
    }
    registerComponent (component, depsMap) {
      this.dependencyStore.addEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.updateDebuggerComponentsMap(component, depsMap)
      }
    }
    unregisterComponent (component, depsMap) {
      this.dependencyStore.removeEntity(component, depsMap)
      if (this.hasDevtools()) {
        this.updateDebuggerComponentsMap(component, null, depsMap)
      }
    }
    updateComponent (component, prevDepsMap, depsMap) {
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
    updateDebuggerComponentsMap (component, nextDeps, prevDeps) {
      const componentDetails = {
        name: this.extractComponentName(component),
        renderCount: component.renderCount ? component.renderCount + 1 : 1,
        id: component.componentDetailsId || this.debuggerComponentDetailsId++
      }
      component.componentDetailsId = componentDetails.id
      component.renderCount = componentDetails.renderCount

      if (prevDeps) {
        for (const depsKey in prevDeps) {
          const debuggerComponents = this.debuggerComponentsMap[prevDeps[depsKey]]

          for (let x = 0; x < debuggerComponents.length; x++) {
            if (debuggerComponents[x].id === component.componentDetailsId) {
              debuggerComponents.splice(x, 1)
              if (debuggerComponents.length === 0) {
                delete this.debuggerComponentsMap[prevDeps[depsKey]]
              }
              break
            }
          }
        }
      }

      if (nextDeps) {
        for (const depsKey in nextDeps) {
          this.debuggerComponentsMap[nextDeps[depsKey]] = (
            this.debuggerComponentsMap[nextDeps[depsKey]]
              ? this.debuggerComponentsMap[nextDeps[depsKey]].concat(componentDetails)
              : [componentDetails]
          )
        }
      }
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
