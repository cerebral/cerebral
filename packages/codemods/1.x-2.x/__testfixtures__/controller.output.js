/* eslint-disable */
import {Controller} from 'cerebral'

import Home from './modules/Home'
import Admin from './modules/Admin'
import doSomething from './chains/doSomething'

const controller = Controller({
  state: {
    // You can add some initial state here if you want
    foo: 'bar'
  },

  modules: {
    home: Home(),
    admin: Admin()
  },

  signals: {
    buttonClicked: doSomething
  }
})

export default controller
