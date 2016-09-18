import React from 'react'
import cleanPath from './cleanPath'

function extractDeps(deps, allDeps) {
  return Object.keys(deps).reduce((depsMap, key) => {
    if (deps[key].getDepsMap) {
      return extractDeps(deps[key].getDepsMap(), allDeps)
    }
    const depsKey = Array.isArray(deps[key]) ? deps[key].join('.') : deps[key]
    depsMap[depsKey] = true

    return depsMap
  }, allDeps)
}

function propsDiffer(previousProps, nextProps) {
  const oldPropKeys = Object.keys(previousProps)
  const newPropKeys = Object.keys(nextProps)
  let hasChange = false

  if (oldPropKeys.length !== newPropKeys.length) {
    hasChange = true
  } else {
    for (let i = 0; i < newPropKeys.length; i++) {
      if (previousProps[newPropKeys[i]] !== nextProps[newPropKeys[i]]) {
        hasChange = true
        break
      }
    }
  }

  return hasChange
}

function getSignalStub(signalName) {
  function stubSignal() {
    // TODO: improve wording, provide at least component and signal names in warning
    console.warn('Cerebral - it is not supposed to run signals with ServerController.')
  }

  stubSignal.signalName = signalName

  return stubSignal
}

export default function(paths, signals, Component) {
  return React.createClass({
    displayName: 'CerebralWrapping_' + (Component.displayName || Component.name),

    contextTypes: {
      cerebral: React.PropTypes.object
    },

    componentWillMount() {
      if (!this.context.cerebral || !this.context.cerebral.controller) {
        throw new Error('Can not find Cerebral controller, did you remember to use the Container component? Read more at: http://www.cerebraljs.com/documentation/cerebral-view-react')
      }

      this.signals = this.context.cerebral.controller.isServer ? {} : this.context.cerebral.controller.getSignals()

      const  statePaths = this.getStatePaths ? this.getStatePaths(this.props) : {}
      if (!Object.keys(statePaths).length) {
        return
      }
      if (!this.context.cerebral.controller.isServer) {
        this.context.cerebral.registerComponent(this, this.getDepsMap(this.props))
      }
    },

    componentWillReceiveProps(nextProps) {
      const hasChange = propsDiffer(this.props, nextProps)

      // If dynamic paths, we need to update them
      if (
        typeof paths === 'function' &&
        propsDiffer(this.getDepsMap(this.props), this.getDepsMap(nextProps))
      ) {
        this.context.cerebral.updateComponent(this, this.getDepsMap(nextProps))
      } else {
        hasChange && this._update()
      }
    },

    shouldComponentUpdate() {
      // We only allow forced render by change of props passed
      // or Container tells it to render
      return false
    },

    componentWillUnmount() {
      this._isUmounting = true
      this.context.cerebral.unregisterComponent(this)
    },

    getDepsMap(props) {
      if (!paths) {
        return {}
      }

      const deps = typeof paths === 'function' ? paths(props) : paths

      return extractDeps(deps, {})
    },

    getProps() {
      const controller = this.context.cerebral.controller
      const props = this.props || {}
      const statePaths = this.getStatePaths ? this.getStatePaths(this.props) : {}

      const propsToPass = Object.keys(statePaths || {}).reduce((currentProps, key) => {
        currentProps[key] = paths[key].getDepsMap ? statePaths[key].get(controller.getState()) : controller.getState(cleanPath(statePaths[key]))
        return props
      }, {})

      propsToPass = Object.keys(props).reduce((currentPropsToPass, key) => {
        currentPropsToPass[key] = props[key]

        return currentPropsToPass
      }, propsToPass)

      if (signals) {
        const extractedSignals = typeof signals === 'function' ? signals(propsToPass) : signals
        propsToPass = Object.keys(extractedSignals).reduce((currentProps, key) => {
          currentProps[key] = controller.isServer
            ? getSignalStub(extractedSignals[key])
            : controller.getSignals(extractedSignals[key])

          return currentProps
        }, propsToPass)
      }

      return propsToPass
    },

    getStatePaths(props) {
      if (!paths) {
        return {}
      }
      return typeof paths === 'function' ? paths(props) : paths
    },

    _update() {
      this._isUmounting || this.forceUpdate()
    },

    render() {
      return React.createElement(Component, this.getProps())
    }
  })
}
