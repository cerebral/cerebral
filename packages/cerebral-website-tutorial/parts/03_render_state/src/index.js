import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import HeaderButton from './components/HeaderButton'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  state: {
    title: 'Hello from Cerebral!'
  }
})

render((
  <Container controller={controller}>
    <HeaderButton />
  </Container>
  ), document.querySelector('#root'))
