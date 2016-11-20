import React from 'react'
import {connect} from 'cerebral/react'
import Simple from '../Simple'

const VIEWS = {
  Simple
}

export default connect({
  currentView: 'app.currentView'
},
function CurrentView ({currentView}) {
  const View = VIEWS[currentView]
  return (
    <div style={{padding: 30, marginTop: 40}}>
      <View />
    </div>
  )
})
