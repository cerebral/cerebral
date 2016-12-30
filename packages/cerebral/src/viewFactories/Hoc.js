import {Computed} from './../Computed'
import {cleanPath, propsDiffer, throwError} from './../utils'

export default (View) => {
  return function HOC (paths, signals, mergeProps, Component) {
    let hasWarnedBigComponent = false
    class CerebralComponent extends View.Component {
      static getStateAndSignalPaths (props) {
        if (!paths) {
          return {}
        }
        return typeof paths === 'function' ? paths(props) : paths
      }
      constructor (props, context) {
        super(props, context)
        this.evaluatedPaths = CerebralComponent.getStateAndSignalPaths(props)
        this.signals = signals
        this.mergeProps = mergeProps
        this.Component = Component
        this.cachedSignals = null
        this.depsMap = this.getDepsMap()
      }
      componentWillMount () {
        if (!this.context.cerebral.controller) {
          throw new Error('Can not find Cerebral controller, did you remember to use the Container component? Read more at: http://www.cerebraljs.com/documentation/cerebral-view-react')
        }

        if (!this.evaluatedPaths) {
          return
        }

        this.context.cerebral.registerComponent(this, this.depsMap)
      }
      componentWillReceiveProps (nextProps) {
        const hasChange = propsDiffer(this.props, nextProps)

        // If dynamic paths, we need to update them
        if (hasChange && typeof paths === 'function') {
          this.evaluatedPaths = CerebralComponent.getStateAndSignalPaths(nextProps, this.context.cerebral.controller)

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
        return Object.keys(this.evaluatedPaths).reduce((currentDepsMap, pathKey) => {
          if (this.evaluatedPaths[pathKey] instanceof Computed) {
            return Object.assign(currentDepsMap, this.evaluatedPaths[pathKey].getDepsMap(this.context.cerebral.controller.model))
          }

          if (typeof this.evaluatedPaths[pathKey] === 'string') {
            console.warn(`Defining state dependencies on components (${Component.displayName}) with strings is DEPRECATED. Use the STATE TAG instead`)
            currentDepsMap[pathKey] = this.evaluatedPaths[pathKey]
          } else {
            const getters = this.createTagGetters()

            return this.evaluatedPaths[pathKey].getTags(getters).reduce((updatedCurrentDepsMap, tag) => {
              if (tag.options.isStateDependency) {
                const path = tag.getPath(getters)

                updatedCurrentDepsMap[path] = path
              }

              return updatedCurrentDepsMap
            }, currentDepsMap)
          }

          return currentDepsMap
        }, {})
      }
      createTagGetters () {
        return {
          state: this.context.cerebral.controller.getState.bind(this.context.cerebral.controller),
          props: this.props,
          signal: this.context.cerebral.controller.getSignal.bind(this.context.cerebral.controller)
        }
      }
      getProps () {
        const controller = this.context.cerebral.controller
        const model = controller.model
        const props = this.props || {}
        const stateAndSignalPaths = CerebralComponent.getStateAndSignalPaths(this.props)
        let stateAndSignalsProps = {}
        let signalProps = {} // DEPRECATED
        let mergeProps = this.mergeProps || {}

        stateAndSignalsProps = Object.keys(stateAndSignalPaths || {}).reduce((currentProps, key) => {
          if (!stateAndSignalPaths[key]) {
            throwError(`There is no path or computed assigned to prop ${key}`)
          }

          if (stateAndSignalPaths[key] instanceof Computed) {
            currentProps[key] = stateAndSignalPaths[key].getValue(model)
          } else if (typeof stateAndSignalPaths[key] === 'string') {
            currentProps[key] = controller.getState(cleanPath(stateAndSignalPaths[key]))
          } else {
            const tag = stateAndSignalPaths[key]
            const getters = this.createTagGetters()

            if (tag.type === 'state') {
              currentProps[key] = controller.getState(cleanPath(tag.getPath(getters)))
            } else if (tag.type === 'signal') {
              currentProps[key] = tag.getValue(getters)
            }
          }

          return currentProps
        }, {})

        if (
          this.context.cerebral.controller.devtools &&
          this.context.cerebral.controller.devtools.bigComponentsWarning &&
          !hasWarnedBigComponent &&
          Object.keys(stateAndSignalPaths || {}).length >= this.context.cerebral.controller.devtools.bigComponentsWarning.state
        ) {
          console.warn(`Component named ${Component.displayName || Component.name} has a lot of state dependencies, consider refactoring or adjust this option in devtools`)
          hasWarnedBigComponent = true
        }

        if (this.signals) {
          if (Object.keys(this.signals).length && mergeProps) {
            console.warn('The signals argument to connect is deprecated, use signal tag instead on first argument. In next version this argument should be removed')
          } else {
            console.warn('The signals argument to connect is deprecated, use signal tag instead on first argument')
          }
          const extractedSignals = typeof signals === 'function' ? signals(props) : signals

          if (
            this.context.cerebral.controller.devtools &&
            this.context.cerebral.controller.devtools.bigComponentsWarning &&
            !hasWarnedBigComponent &&
            Object.keys(extractedSignals).length >= this.context.cerebral.controller.devtools.bigComponentsWarning.signals
          ) {
            console.warn(`Component named ${Component.displayName || Component.name} has a lot of signals, consider refactoring or adjust this option in devtools`)
            hasWarnedBigComponent = true
          }
          signalProps = Object.keys(extractedSignals).reduce((currentProps, key) => {
            currentProps[key] = controller.getSignal(extractedSignals[key])

            return currentProps
          }, {})
        }

        if (mergeProps && typeof mergeProps === 'function') {
          return mergeProps(stateAndSignalsProps, signalProps, props)
        }

        const propsToPass = Object.assign({}, props, stateAndSignalsProps, signalProps, mergeProps)

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
