import DependencyTracker from '../DependencyTracker'
import {Compute} from '../Compute'
import {getChangedProps, throwError, ensureStrictPath, createResolver} from './../utils'

export default (View) => {
  class BaseComponent extends View.Component {
    constructor (dependencies, mergeProps, props, context) {
      super(props, context)
      this.stateGetter = this.stateGetter.bind(this)
      this.signalGetter = this.signalGetter.bind(this)
      this.mergeProps = mergeProps
      /*
        First we find any dependency functions to convert to DependencyTrackers.
        They are instantly run to produce their value and map of state
        dependencies
      */
      this.dependencyTrackers = Object.keys(dependencies).reduce((currentDependencyTrackers, dependencyKey) => {
        if (dependencies[dependencyKey] instanceof Compute) {
          currentDependencyTrackers[dependencyKey] = new DependencyTracker(dependencies[dependencyKey])
          currentDependencyTrackers[dependencyKey].run(this.stateGetter, props)
        }

        return currentDependencyTrackers
      }, {})
      this.dependencies = dependencies
      this.dependencyTrackersDependencyMaps = this.getDependencyTrackersDependencyMaps(props)
      this.tagsDependencyMap = this.getTagsDependencyMap(props)
    }
    /*
      Register the component to the dependency store with its
      state tracker and tags state dependencies
    */
    componentWillMount () {
      if (!this.context.cerebral.controller) {
        throwError('Can not find controller, did you remember to use the Container component? Read more at: https://cerebral.github.io/api/05_connect.html')
      }

      this.context.cerebral.registerComponent(this, Object.assign(
        {},
        this.dependencyTrackersDependencyMaps.state,
        this.tagsDependencyMap
      ))
    }
    /*
      We only allow forced render by change of props passed
      or Container tells it to render
    */
    shouldComponentUpdate () {
      return false
    }
    /*
      If received props differ, we need to update any
      StateTrackers and tags, cause they might be using
      props to define a state dependency
    */
    componentWillReceiveProps (nextProps) {
      const propsChanges = getChangedProps(this.props, nextProps)
      if (propsChanges.length) {
        this._updateFromProps(propsChanges, nextProps)
      }
    }
    /*
      Unregister with existing state dependencies
    */
    componentWillUnmount () {
      this._isUnmounting = true
      this.context.cerebral.unregisterComponent(this, Object.assign(
        {},
        this.dependencyTrackersDependencyMaps.state,
        this.tagsDependencyMap
      ))
    }
    /*
      A getter for StateTracker and tags to grab state from Cerebral
    */
    stateGetter (path) {
      return this.context.cerebral.controller.getState(path)
    }
    /*
      A getter for tags to grab signals from Cerebral
    */
    signalGetter (path) {
      return this.context.cerebral.controller.getSignal(path)
    }
    /*
      Go through dependencies and identify state trackers and
      merge in their state dependencies
    */
    getDependencyTrackersDependencyMaps (props) {
      return Object.keys(this.dependencies).reduce((currentDepsMaps, propKey) => {
        if (this.dependencyTrackers[propKey]) {
          currentDepsMaps.state = Object.assign(currentDepsMaps.state, this.dependencyTrackers[propKey].stateTrackFlatMap)
          currentDepsMaps.props = Object.assign(currentDepsMaps.props, this.dependencyTrackers[propKey].propsTrackFlatMap)

          return currentDepsMaps
        }

        return currentDepsMaps
      }, {
        state: {},
        props: {}
      })
    }
    /*
      Go through dependencies and extract tags related to state
      dependencies
    */
    getTagsDependencyMap (props) {
      return Object.keys(this.dependencies).reduce((currentDepsMap, propKey) => {
        if (this.dependencyTrackers[propKey]) {
          return currentDepsMap
        }

        const getters = this.createTagGetters(props)

        return this.dependencies[propKey].getTags(getters).reduce((updatedCurrentDepsMap, tag) => {
          if (tag.options.isStateDependency) {
            const path = tag.getPath(getters)
            const strictPath = ensureStrictPath(path, this.stateGetter(path))

            updatedCurrentDepsMap[strictPath] = true
          }

          return updatedCurrentDepsMap
        }, currentDepsMap)
      }, {})
    }
    /*
      Creates getters passed into tags
    */
    createTagGetters (props) {
      return {
        state: this.stateGetter,
        props: props,
        signal: this.signalGetter
      }
    }
    /*
      Runs whenever the component has an update and renders.
      Extracts the actual values from dependency trackers and/or tags
    */
    getProps () {
      const props = this.props || {}
      const dependenciesProps = Object.keys(this.dependencies).reduce((currentProps, key) => {
        if (!this.dependencies[key]) {
          throwError(`There is no dependency assigned to prop ${key}`)
        }

        if (this.dependencyTrackers[key]) {
          currentProps[key] = this.dependencyTrackers[key].value
        } else {
          const tag = this.dependencies[key]
          const getters = this.createTagGetters(props)

          if (tag.type === 'state') {
            const path = tag.getPath(getters)
            const value = this.stateGetter(path)

            if (path.indexOf('.*') > 0) {
              currentProps[key] = value ? Object.keys(value) : []
            } else {
              currentProps[key] = value
            }
          } else if (tag.type === 'signal' || tag.type === 'props') {
            currentProps[key] = tag.getValue(getters)
          }
        }

        return currentProps
      }, {})

      if (
        this.context.cerebral.controller.devtools &&
        this.context.cerebral.controller.devtools.bigComponentsWarning &&
        !this._hasWarnedBigComponent &&
        Object.keys(this.dependencies || {}).length >= this.context.cerebral.controller.devtools.bigComponentsWarning
      ) {
        console.warn(`Component named ${this._displayName} has a lot of dependencies, consider refactoring or adjust this option in devtools`)
        this._hasWarnedBigComponent = true
      }

      if (this.mergeProps) {
        return this.mergeProps(dependenciesProps, props, createResolver(this.createTagGetters(props)))
      }

      return Object.assign({}, props, dependenciesProps)
    }
    /*
      Udpates the dependency trackers by checking state
      changes and props changes
    */
    updateDependencyTrackers (stateChanges, propsChanges, props) {
      const hasChanged = Object.keys(this.dependencyTrackers).reduce((hasChanged, key) => {
        if (this.dependencyTrackers[key].match(stateChanges, propsChanges)) {
          this.dependencyTrackers[key].run(this.stateGetter, props)

          return true
        }

        return hasChanged
      }, false)

      return hasChanged
    }
    /*
      Called by component when props are passed from parent and they
      have changed. In this situation both tags and depndency trackers might
      be affected. Tags are just updated and dependency trackers are matched
      on props changed
    */
    _updateFromProps (propsChanges, props) {
      this._update(props, this.updateDependencyTrackers({}, propsChanges, props))
    }
    /*
      Called by Container when the components state dependencies
      has changed. In this scenario we need to run any dependencyTrackers
      that matches the state changes. There is no need to update the tags
      as their declared state deps can not change
    */
    _updateFromState (stateChanges) {
      if (this._isUnmounting) {
        return
      }

      this._update(this.props, this.updateDependencyTrackers(stateChanges, {}, this.props))
    }
    /*
      Run update, re-evaluating the tags and computed, if neccessary
    */
    _update (props, hasChangedDependencyTrackers) {
      const prevDependencyTrackersDependencyMaps = this.dependencyTrackersDependencyMaps
      const previousTagsDependencyMap = this.tagsDependencyMap

      this.tagsDependencyMap = this.getTagsDependencyMap(props)
      this.dependencyTrackersDependencyMaps = hasChangedDependencyTrackers ? this.getDependencyTrackersDependencyMaps(props) : this.dependencyTrackersDependencyMaps

      const prevDepsMap = Object.assign(
        {},
        prevDependencyTrackersDependencyMaps.state,
        previousTagsDependencyMap
      )
      const nextDepsMap = Object.assign(
        {},
        this.dependencyTrackersDependencyMaps.state,
        this.tagsDependencyMap
      )

      this.context.cerebral.updateComponent(this, prevDepsMap, nextDepsMap)

      this.forceUpdate()
    }
  }

  return function HOC (dependencies, mergeProps, Component) {
    if (typeof dependencies === 'function') {
      throwError('You can not use a function to define dependencies. Use tags or a function on the specific property you want to dynamically create')
    }

    if (!dependencies) {
      throwError('There is no reason to connect a component that has no dependencies')
    }

    class CerebralComponent extends BaseComponent {
      constructor (props, context) {
        super(dependencies, mergeProps, props, context)
        this._displayName = Component.displayName || Component.name
        this._hasWarnedBigComponent = false
      }
      toJSON () {
        return this._displayName
      }
      render () {
        return View.createElement(Component, this.getProps())
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
