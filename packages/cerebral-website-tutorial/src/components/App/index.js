import React from 'react'
import { connect } from 'cerebral/react'
import HeaderButton from '../HeaderButton'
import Toast from '../Toast'
import Input from '../Input'
import LoadDataButton from '../LoadDataButton'

export default connect({
  appTitle: 'appTitle'
}, {
}, function App(props) {
  return (
    <div className='o-container o-container--medium'>
      <h1 className='u-high'>{ props.appTitle }</h1>
      <HeaderButton />
      <br/>
      <Input />
      <br/>
      <LoadDataButton/>
      <Toast />
    </div>
  )
}
)
