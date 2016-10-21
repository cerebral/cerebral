import React from 'react'
import run from '../../run'
import './styles.css'

import AddAssignment from '../AddAssignment'
import Assignments from '../Assignments'

import appMounted from '../../events/appMounted'

class App extends React.Component {
  componentDidMount () {
    run('appMounted', appMounted)
  }
  render () {
    return (
      <div className='App'>
        <AddAssignment />
        <Assignments />
      </div>
    )
  }
}

export default App
