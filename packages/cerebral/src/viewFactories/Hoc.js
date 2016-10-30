import {Computed} from './../Computed'
import {cleanPath, propsDiffer} from './../utils'

export default (View) => {
  return function HOC (paths, signals, Component) {
    class CerebralComponent extends View.Component {
      constructor (props) {
        super(props)
        this.evaluatedPaths = this.getStatePaths(props)
        this.signals = signals
        this.Component = Component
        this.depsMap = this.getDepsMap()
        this.forceUpdateComputed = false
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
        if (typeof paths === 'function') {
          this.evaluatedPaths = this.getStatePaths(nextProps)

          const nextDepsMap = this.getDepsMap()

          if (propsDiffer(this.depsMap, nextDepsMap)) {
            this.context.cerebral.updateComponent(this, this.depsMap, nextDepsMap)
            this.depsMap = nextDepsMap
          }
        } else if (hasChange) {
          this._update()
        }
      }
      shouldComponentUpdate () {
        // We only allow forced render by change of props passed
        // or Container tells it to render
        return false
      }
      componentWillUnmount () {
        this._isUmounting = true
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
            return Object.assign(currentDepsMap, this.evaluatedPaths[pathKey].depsMap)
          }

          currentDepsMap[pathKey] = this.evaluatedPaths[pathKey]

          return currentDepsMap
        }, {})
      }
      getStatePaths (props) {
        if (!paths) {
          return {}
        }
        return typeof paths === 'function' ? paths(props) : paths
      }
      getProps () {
        const controller = this.context.cerebral.controller
        const model = controller.model
        const props = this.props || {}
        const statePaths = this.getStatePaths(this.props)

        let propsToPass = Object.assign({}, props, Object.keys(statePaths || {}).reduce((currentProps, key) => {
          if (this.forceUpdateComputed && statePaths[key] instanceof Computed) {
            statePaths[key].flag()
          }
          currentProps[key] = statePaths[key] instanceof Computed ? statePaths[key].getValue(model) : controller.getState(cleanPath(statePaths[key]))
          return currentProps
        }, {}))

        if (this.signals) {
          const extractedSignals = typeof signals === 'function' ? signals(propsToPass) : signals

          propsToPass = Object.keys(extractedSignals).reduce((currentProps, key) => {
            currentProps[key] = controller.getSignal(extractedSignals[key])

            return currentProps
          }, propsToPass)
        }

        return propsToPass
      }
      _update (force) {
        if (this._isUmounting) {
          return
        }

        this.forceUpdateComputed = Boolean(force)

        this.forceUpdate()
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
