import Component from 'inferno-component'
import {createDummyController} from '../../utils'

class StateContainer extends Component {
  getChildContext () {
    const controller = createDummyController(this.props.state, this.props.signals)
    return {
      controller: controller
    }
  }
  render () {
    return this.props.children
  }
}

export default StateContainer
