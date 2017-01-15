import React from 'react'
import {render} from 'react-dom'
import App from './components/App'
import {Provider} from 'react-redux'
import store from './store'

export default function () {
  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.querySelector('#root'))
}
