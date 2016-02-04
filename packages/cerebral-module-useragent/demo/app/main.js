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
  feature: {
    touch: true,
    webGL: true,
    getUserMedia: () => !!navigator.getUserMedia
  },
  media: {
    small: '(min-width: 600px)',
    medium: '(min-width: 1024px)',
    large: '(min-width: 1440px)',
    portrait: '(orientation: portrait)'

  },
  window: true
})

const devtools = Devtools()

controller.addModules({
  ua: useragent,
  devtools
})

ReactDOM.render((
  <Container controller={controller}>
    <App />
  </Container>
), document.getElementById('root'))
