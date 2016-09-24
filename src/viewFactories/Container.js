import DependencyStore from '../DependencyStore'

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
      return {
        cerebral: {
          controller: this.props.controller,
          registerComponent: this.registerComponent,
          unregisterComponent: this.unregisterComponent,
          updateComponent: this.updateComponent
        }
      }
    }
    componentDidMount() {
      this.props.controller.on('flush', this.onCerebralUpdate)

      if (this.props.controller.debugger) {
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
    extractComponentName(component) {
      return component.constructor.displayName.replace('CerebralWrapping_', '')
    }
    onCerebralUpdate(changes, force) {
      const componentsToRender = force ? this.dependencyStore.getAllUniqueEntities() : this.dependencyStore.getUniqueEntities(changes)
      const start = Date.now()
      componentsToRender.forEach((component) => {
        if (this.props.controller.debugger) {
          component.renderCount = 'renderCount' in component ? component.renderCount + 1 : 1
        }
        component._update()
      })
      const end = Date.now()

      if (this.props.controller.devtools) {
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
      if (this.props.controller.devtools) {
        this.updateDebuggerComponentsMap(component, depsMap)
      }
    }
    unregisterComponent(component, depsMap) {
      this.dependencyStore.removeEntitu(component, depsMap)
      if (this.props.controller.devtools) {
        this.updateDebuggerComponentsMap(component, depsMap)
      }
    }
    updateComponent(component, prevDepsMap, depsMap) {
      this.dependencyStore.removeEntity(component, prevDepsMap)
      this.dependencyStore.addEntity(component, depsMap)
      if (this.props.controller.devtools) {
        this.updateDebuggerComponentsMap(component, depsMap, prevDepsMap)
      }
      component._update()
    }
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

  Container.propTypes = {
    controller: View.PropTypes.object.isRequired,
    children: View.PropTypes.node.isRequired
  }
  Container.childContextTypes = {
    cerebral: View.PropTypes.object.isRequired
  }

  return Container
}
