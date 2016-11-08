import {ensurePath, noop} from '../utils'

export default (View) => {
  class StateContainer extends View.Component {
    getChildContext () {
      const controller = createDummyController(this.props.state)
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

  if (View.PropTypes) {
    StateContainer.propTypes = {
      state: View.PropTypes.object,
      children: View.PropTypes.node.isRequired
    }
    StateContainer.childContextTypes = {
      cerebral: View.PropTypes.object.isRequired
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
function createDummyController (state = {}) {
  return {
    options: {},
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
