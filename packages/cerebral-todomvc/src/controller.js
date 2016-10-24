import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'

import App from './modules/app'

const controller = Controller({
  strictRender: true,
  devtools: Devtools(),
  router: Router({
    onlyHash: true,
    routes: {
      '/': 'app.rootRouted',
      '/:filter': 'app.filterClicked'
    }
  }),
  modules: {
    app: App
  }
})

export default controller
