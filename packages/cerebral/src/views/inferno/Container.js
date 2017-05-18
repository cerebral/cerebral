import Component from 'inferno-component'
import {throwError} from '../../utils'

class Container extends Component {
  getChildContext () {
    const {controller} = this.props
    if (!controller) {
      throwError('You are not passing controller to Container')
    }

    return {
      controller: controller
    }
  }
  render () {
    return this.props.children
  }
}

export default Container
