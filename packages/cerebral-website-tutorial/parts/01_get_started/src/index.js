import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import HeaderButton from './components/HeaderButton'
import { Container } from 'cerebral/react'

const controller = Controller({

})

render((
  <Container controller={controller}>
    <HeaderButton />
  </Container>
  ), document.querySelector('#root'))
