import {ensurePath, noop} from '../utils'

export default (View, PropTypes) => {
  class StateContainer extends View.Component {
    getChildContext () {
      const controller = createDummyController(this.props.state, this.props.signals)
      return {
        cerebral: {
          controller: controller,
          registerComponent: noop,
          unregisterComponent: noop,
          updateComponent: noop
        }
      }
    }
    render () {
      return this.props.children
    }
  }

  if (PropTypes != null) {
    StateContainer.propTypes = {
      state: PropTypes.object,
      children: PropTypes.node.isRequired
    }
    StateContainer.childContextTypes = {
      cerebral: PropTypes.object.isRequired
    }
  }

  return StateContainer
}

/*
  When testing and running on the server there is no need to
  initialize all of Cerebral. So by not passing a controller
  to this Container it will create a dummy version which inserts
  state and mocks any signals when connecting the component.
*/
function createDummyController (state = {}, signals = {}) {
  const getState = (path) => {
    return ensurePath(path).reduce((currentState, pathKey) => {
      return currentState ? currentState[pathKey] : undefined
    }, state)
  }
  return {
    options: {},
    on () {},
    getState,
    model: {
      get: getState
    },
    getSignal (signal) {
      return signals[signal] || (() => {})
    }
  }
}
