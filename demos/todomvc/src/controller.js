import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import {RecorderProvider} from 'cerebral/providers'
import App from './modules/app'
import Recorder from './modules/recorder'

const controller = Controller({
  options: {strictRender: true},
  devtools: Devtools({
    remoteDebugger: 'localhost:8787'
  }),
  router: Router({
    onlyHash: true,
    routes: {
      '/': 'app.rootRouted',
      '/:filter': 'app.filterClicked'
    }
  }),
  providers: [RecorderProvider()],
  modules: {
    app: App,
    recorder: Recorder
  }
})

export default controller
