import {Controller} from 'cerebral'
import Model from 'cerebral/models/immutable'

import App from './modules/app'
import Devtools from 'cerebral-module-devtools'
import Recorder from 'cerebral-module-recorder'
import Router from 'cerebral-module-router'

const controller = Controller(Model({}))

controller.addModules({
  app: App,

  recorder: Recorder(),
  devtools: Devtools(),
  router: Router({
    '/': 'app.rootRouted',
    '/:filter': 'app.filterClicked'
  }, {
    onlyHash: true
  })
})

export default controller
