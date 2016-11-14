import Prism from 'common/prism';
import React from 'react';
import ReactDOM from 'react-dom';
import {onChange} from 'connector';
import {Controller} from 'cerebral';
import {Container} from 'cerebral/react';
import UserAgent from 'cerebral-module-useragent';
import Devtools from 'cerebral/devtools';
import DebuggerModule from './modules/Debugger';
import Debugger from './components/Debugger';

let currentController = null

export default {
  render: function () {
    onChange((payload) => {
      if (payload.type !== 'init' && !currentController) {
        return;
      }

      if (!currentController) {
        currentController = Controller({
          devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
          modules: {
            debugger: DebuggerModule,
            useragent: UserAgent({
              media: {
                small: '(max-width: 1270px)'
              }
            })
          }
        });
        ReactDOM.render((
          <Container controller={currentController} style={{height: '100%'}}>
            <Debugger/>
          </Container>
        ), document.getElementById('root'));
      }

      currentController.getSignal('debugger.payloadReceived')(payload);
    });
  }
};
