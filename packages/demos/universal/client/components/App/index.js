import React from 'react'
import { connect } from 'cerebral/react'
import { state } from 'cerebral/tags'

export default connect(
  {
    name: state`app.name`,
  },
  function App({ name }) {
    return (
      <div>
        <h1>Hello, {name}</h1>
        <h4>Change the name using query: <b>?name=christian</b></h4>
      </div>
    )
  }
)
