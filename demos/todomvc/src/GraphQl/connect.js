import React from 'react'
import {connect} from 'cerebral/react'
import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import PropTypes from 'prop-types'
import getPaths from './getPaths'

function graphqlConnect (dependencies, ...rest) {
  class Comp extends React.Component {
    constructor (props, context) {
      super(props)
      this.queries = {}
      this.stateGetter = context.cerebral.controller.getState.bind(context.cerebral.controller)
    }
    componentWillMount () {
      const evaluatedDependencies = Object.keys(dependencies).reduce((currentDependencies, key) => {
        if (dependencies[key].type === 'query') {
          this.queries[key] = dependencies[key].getPath({props: this.props, state: this.stateGetter})
          currentDependencies[key] = compute((get) => {
            const paths = getPaths(this.queries[key])

            return paths.reduce((result, path) => {
              const key = path.slice().pop()

              // Populate objects into result
              result[key] = get(state`graphql.data.${path.join('.')}`)

              return result
            }, {})
          })
        } else {
          currentDependencies[key] = dependencies[key]
        }

        return currentDependencies
      }, {})
      this.connectedComponent = connect(evaluatedDependencies, rest[rest.length - 1])
    }
    componentDidMount () {
      Object.keys(this.queries).forEach((key) => {
        this.context.cerebral.controller.getSignal('graphql.test')({query: this.queries[key]})
      })
    }
    render () {
      return React.createElement(this.connectedComponent, this.props)
    }
  }

  Comp.contextTypes = {
    cerebral: PropTypes.object
  }

  return Comp
}

export default graphqlConnect
