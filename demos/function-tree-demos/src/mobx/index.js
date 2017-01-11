import React from 'react'
import {render} from 'react-dom'
import App from './components/App'
import store from './store'

export default function () {
  render((
    <App store={store} />
  ), document.querySelector('#root'))
}
