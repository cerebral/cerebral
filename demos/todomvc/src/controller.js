import {Controller} from 'cerebral'
import {state, input} from 'cerebral/tags' // eslint-disable-line no-unused-vars
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import {RecorderProvider} from 'cerebral/providers'
import App from './modules/app'
import Recorder from './modules/recorder'

const controller = Controller({
  devtools: Devtools({
    remoteDebugger: 'localhost:8787'
  }),
  providers: [RecorderProvider()],
  modules: {
    app: App,
    router: Router({
      onlyHash: true,
      filterFalsy: true,
      routes: [
        {path: '/', signal: 'app.rootRouted'},
        // simple map to signal. all parsed path and queries params goes to signal
        // {path: '/:filter', signal: 'app.filterClicked'}
        // map to signal + state
        {path: '/:filterName', signal: 'app.filterClicked', map: {filterName: input`filter`, title: state`app.newTodoTitle`}}
        // map to state only.
        // {path: '/:filterName', map: {filterName: state`app.filter`, title: state`app.newTodoTitle`}}
      ]
    }),
    recorder: Recorder
  }
})

export default controller
