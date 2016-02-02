import React from 'react'
import ReactDOM from 'react-dom'
import Controller from 'cerebral'
import Model from 'cerebral-model-baobab'
import { Container } from 'cerebral-view-react'
import App from './components/App'
import Devtools from 'cerebral-module-devtools'
import Useragent from '../../src'

const controller = Controller(Model({}))

const useragent = Useragent({
  parse: {
    browser: true,
    device: true,
    os: true
  },
  detect: {
    xxx: () => {}
  }
})

const devtools = Devtools()

controller.addModules({
  useragent,
  devtools
})

ReactDOM.render((
  <Container controller={controller}>
    <App />
  </Container>
), document.getElementById('root'))
