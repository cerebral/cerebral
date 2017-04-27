import React from 'react'
import {state} from 'cerebral/tags'
import PropTypes from 'prop-types'
import createComputed from './createComputed'

export default (View, PropTypes, connect) => {
  function graphqlConnect (dependencies, ...rest) {
    class Connect extends React.Component {
      constructor (props, context) {
        super(props)
        this.queries = {}
        this.stateGetter = context.cerebral.controller.getState.bind(context.cerebral.controller)
      }
      componentWillMount () {
        const evaluatedDependencies = Object.keys(dependencies).reduce((currentDependencies, key) => {
          if (dependencies[key].type === 'query') {
            this.queries[key] = dependencies[key].getPath({props: this.props, state: this.stateGetter})
            currentDependencies[key] = createComputed(this.queries[key])
          } else {
            currentDependencies[key] = dependencies[key]
          }

          return currentDependencies
        }, {})
        this.connectedComponent = connect(evaluatedDependencies, rest[rest.length - 1])
      }
      componentDidMount () {
        Object.keys(this.queries).forEach((key) => {
          this.context.cerebral.controller.getSignal('graphql.queried')({query: this.queries[key]})
        })
      }
      render () {
        return React.createElement(this.connectedComponent, this.props)
      }
    }

    Connect.contextTypes = {
      cerebral: PropTypes.object
    }

    return Connect
  }

  return graphqlConnect
}
