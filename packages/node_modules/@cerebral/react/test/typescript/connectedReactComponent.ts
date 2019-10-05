import * as React from 'react'
import { connect } from '../../'
import { state } from 'cerebral/tags'

export const Running = connect(
  {
    composing: state`composer.$running`,
    error: state`composer.$error`,
  },
  function Running() {
    return React.createElement('div', {}, 'hello')
  }
)
