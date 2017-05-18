import Component from 'inferno-component'
import createElement from 'inferno-create-element'
import {throwError} from '../../utils'
import View from '../View'

class BaseComponent extends Component {
  constructor (dependencies, mergeProps, props, controller, name) {
    super(props)
    if (!controller) {
      throwError('Can not find controller, did you remember to use the Container component? Read more at: https://cerebral.github.io/api/05_connect.html')
    }

    this.onUpdate = this.onUpdate.bind(this)
    this.view = new View({
      dependencies,
      mergeProps,
      props,
      controller: controller,
      displayName: name,
      onUpdate: this.onUpdate
    })
  }
  /*
    Register the component to the dependency store with its
    state tracker and tags state dependencies
  */
  componentWillMount () {
    this.view.onMount()
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
    const hasUpdate = this.view.onPropsUpdate(this.props, nextProps)
    if (hasUpdate) {
      this.forceUpdate()
    }
  }
  /*
    Unregister with existing state dependencies
  */
  componentWillUnmount () {
    this._isUnmounting = true
    this.view.onUnMount()
  }
  onUpdate (stateChanges, force) {
    if (this._isUnmounting) {
      return
    }
    this.view.updateFromState(stateChanges, this.props, force)
    this.forceUpdate()
  }
}

export default function HOC (dependencies, mergeProps, Component) {
  if (typeof dependencies === 'function') {
    throwError('You can not use a function to define dependencies. Use tags or a function on the specific property you want to dynamically create')
  }

  if (!dependencies) {
    throwError('There is no reason to connect a component that has no dependencies')
  }

  class CerebralComponent extends BaseComponent {
    constructor (props, context) {
      super(dependencies, mergeProps, props, context.controller, Component.displayName || Component.name)
    }
    toJSON () {
      return this.view._displayName
    }
    render () {
      return createElement(Component, this.view.getProps(this.props))
    }
  }
  CerebralComponent.displayName = `CerebralWrapping_${Component.displayName || Component.name}`

  return CerebralComponent
}
