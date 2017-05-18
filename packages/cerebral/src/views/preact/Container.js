import {Component} from 'preact'
import {throwError} from '../../utils'

class Container extends Component {
  getChildContext (props) {
    const {controller} = this.props
    if (!controller) {
      throwError('You are not passing controller to Container')
    }

    return {controller}
  }
  render (props) {
    return props.children[0]
  }
}

export default Container
