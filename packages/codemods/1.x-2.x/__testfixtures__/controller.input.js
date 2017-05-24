/* eslint-disable */
import {Controller} from 'cerebral'
import Model from 'cerebral/models/immutable'

import Home from './modules/Home'
import Admin from './modules/Admin'
import doSomething from './chains/doSomething'

const controller = Controller(Model({
  // You can add some initial state here if you want
  foo: 'bar'
}))

controller.addModules({
  home: Home,
  admin: Admin
})

controller.addSignals({
  buttonClicked: doSomething
})

export default controller
