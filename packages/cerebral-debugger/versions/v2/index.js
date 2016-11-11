import Prism from 'common/prism';
import React from 'react';
import ReactDOM from 'react-dom';
import {onChange} from 'connector';
import {Controller} from 'cerebral';
import Model from 'cerebral-model-immutable';
import {Container} from 'cerebral-view-react';
import UserAgent from 'cerebral-module-useragent';
import Devtools from 'cerebral-module-devtools';
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
        currentController = Controller(Model({}));
        currentController.addModules({
          debugger: DebuggerModule,

          devtools: process.env.NODE_ENV === 'production' ? function () {} : Devtools(),
          useragent: UserAgent({
            media: {
              small: '(max-width: 1270px)'
            }
          })
        });
        ReactDOM.render((
          <Container controller={currentController} style={{height: '100%'}}>
            <Debugger/>
          </Container>
        ), document.getElementById('root'));
      }

      currentController.getSignals().debugger.payloadReceived(payload);
    });
  }
};
