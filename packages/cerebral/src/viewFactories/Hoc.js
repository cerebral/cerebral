import {Computed} from './../Computed'
import {cleanPath, propsDiffer} from './../utils'

export default (View) => {
  return function HOC (paths, signals, injectedProps, Component) {
    class CerebralComponent extends View.Component {
      static getStatePaths (props, controller) {
        if (!paths) {
          return {}
        }

        if (typeof paths === 'function') {
          const dynamicPaths = {}
          const getState = (path) => {
            dynamicPaths[`__${path}`] = path

            return controller.getState(path)
          }
          return {
            static: paths(props, getState),
            dynamic: dynamicPaths
          }
        }

        return {
          static: paths,
          dynamic: {}
        }
      }
      constructor (props, context) {
        super(props, context)
        if (!context.cerebral || !context.cerebral.controller) {
          throw new Error('Can not find Cerebral controller, did you remember to use the Container component? Read more at: http://www.cerebraljs.com/documentation/cerebral-view-react')
        }

        this.evaluatedPaths = CerebralComponent.getStatePaths(this.props, context.cerebral.controller)
        this.signals = signals
        this.injectedProps = injectedProps
        this.Component = Component
        this.cachedSignals = null
        this.depsMap = this.getDepsMap()
      }
      componentWillMount () {
        if (!this.evaluatedPaths) {
          return
        }

        this.context.cerebral.registerComponent(this, this.depsMap)
      }
      componentWillReceiveProps (nextProps) {
        const hasChange = propsDiffer(this.props, nextProps)

        // If dynamic paths, we need to update them
        if (hasChange && typeof paths === 'function') {
          this.evaluatedPaths = CerebralComponent.getStatePaths(nextProps, this.context.cerebral.controller)

          const nextDepsMap = this.getDepsMap()

          if (propsDiffer(this.depsMap, nextDepsMap)) {
            this.context.cerebral.updateComponent(this, this.depsMap, nextDepsMap)
            this.depsMap = nextDepsMap
          }
        }

        if (hasChange) {
          this._update()
        }
      }
      shouldComponentUpdate () {
        // We only allow forced render by change of props passed
        // or Container tells it to render
        return false
      }
      componentWillUnmount () {
        this._isUnmounting = true
        this.context.cerebral.unregisterComponent(this, this.depsMap)
        Object.keys(this.depsMap).forEach((depsMapKey) => {
          if (this.depsMap[depsMapKey] instanceof Computed) {
            this.depsMap[depsMapKey].remove()
          }
        })
      }
      getDepsMap () {
        const allDeps = Object.assign({}, this.evaluatedPaths.static, this.evaluatedPaths.dynamic)

        return Object.keys(allDeps).reduce((currentDepsMap, pathKey) => {
          if (allDeps[pathKey] instanceof Computed) {
            return Object.assign(currentDepsMap, allDeps[pathKey].depsMap)
          }

          currentDepsMap[pathKey] = allDeps[pathKey]

          return currentDepsMap
        }, {})
      }
      getProps () {
        const controller = this.context.cerebral.controller
        const model = controller.model
        const props = this.props || {}
        const statePaths = CerebralComponent.getStatePaths(this.props, this.context.cerebral.controller)

        let propsToPass = Object.assign({}, props, Object.keys(statePaths ? statePaths.static : {}).reduce((currentProps, key) => {
          currentProps[key] = statePaths.static[key] instanceof Computed ? statePaths.static[key].getValue(model) : controller.getState(cleanPath(statePaths.static[key]))
          return currentProps
        }, {}))

        if (
          this.context.cerebral.controller.devtools &&
          this.context.cerebral.controller.devtools.bigComponentsWarning &&
          Object.keys(statePaths || {}).length >= this.context.cerebral.controller.devtools.bigComponentsWarning.state
        ) {
          console.warn(`Component named ${Component.displayName || Component.name} has a lot of state dependencies, consider refactoring. Adjust this option in devtools`)
        }

        if (this.signals) {
          const extractedSignals = typeof signals === 'function' ? signals(propsToPass) : signals

          if (
            this.context.cerebral.controller.devtools &&
            this.context.cerebral.controller.devtools.bigComponentsWarning &&
            Object.keys(extractedSignals).length >= this.context.cerebral.controller.devtools.bigComponentsWarning.signals
          ) {
            console.warn(`Component named ${Component.displayName || Component.name} has a lot of signals, consider refactoring. Adjust this option in devtools`)
          }
          propsToPass = Object.keys(extractedSignals).reduce((currentProps, key) => {
            currentProps[key] = controller.getSignal(extractedSignals[key])

            return currentProps
          }, propsToPass)
        }

        if (this.injectedProps) {
          propsToPass = Object.keys(this.injectedProps).reduce((currentProps, key) => {
            currentProps[key] = this.injectedProps[key]

            return currentProps
          }, propsToPass)
        }

        if (this.context.cerebral.controller.options.signalsProp) {
          propsToPass.signals = this.cachedSignals = this.cachedSignals || this.extractModuleSignals(this.context.cerebral.controller.module, '')
        }

        return propsToPass
      }
      extractModuleSignals (module, parentPath) {
        return Object.keys(module.signals || {}).reduce((signals, signalKey) => {
          signals[signalKey] = this.context.cerebral.controller.getSignal(parentPath ? `${parentPath}.${signalKey}` : `${signalKey}`)

          return signals
        }, Object.keys(module.modules || {}).reduce((modules, moduleKey) => {
          modules[moduleKey] = this.extractModuleSignals(module.modules[moduleKey], parentPath ? `${parentPath}.${moduleKey}` : `${moduleKey}`)

          return modules
        }, {}))
      }
      _update () {
        if (!this._isUnmounting) {
          this.forceUpdate()
        }
      }
      render () {
        return View.createElement(this.Component, this.getProps())
      }
    }
    CerebralComponent.displayName = `CerebralWrapping_${Component.displayName || Component.name}`

    if (View.PropTypes) {
      CerebralComponent.contextTypes = {
        cerebral: View.PropTypes.object
      }
    }

    return CerebralComponent
  }
}
