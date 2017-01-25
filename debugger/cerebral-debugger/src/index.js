import 'prismjs'
import 'prismjs/plugins/line-highlight/prism-line-highlight'
import './common/icons.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/react'
import UserAgent from 'cerebral-module-useragent'
import Devtools from 'cerebral/devtools'
import DebuggerModule from './modules/Debugger'
import Debugger from './components/Debugger'
import connector from 'connector'

let currentController

connector.connect(() => {
  connector.onEvent((payload) => {
    if (payload.type !== 'init' && !currentController) {
      return
    }

    if (!currentController) {
      document.body.removeChild(document.querySelector('#error'))
      currentController = Controller({
        devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
        options: {
          strictRender: true
        },
        modules: {
          debugger: DebuggerModule,
          useragent: UserAgent({
            media: {
              small: '(max-width: 1270px)'
            }
          })
        }
      })
      ReactDOM.render((
        <Container controller={currentController} style={{height: '100%'}}>
          <Debugger />
        </Container>
      ), document.getElementById('root'))
    }

    currentController.getSignal('debugger.payloadReceived')(payload)
  })
})
