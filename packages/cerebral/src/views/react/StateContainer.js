import React from 'react'
import PropTypes from 'prop-types'
import {createDummyController} from '../../utils'

class StateContainer extends React.Component {
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

StateContainer.propTypes = {
  state: PropTypes.object,
  children: PropTypes.node.isRequired
}
StateContainer.childContextTypes = {
  controller: PropTypes.object.isRequired
}

export default StateContainer
