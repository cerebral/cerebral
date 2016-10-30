import {onChange} from 'connector';
import React from 'react';
import Controller from 'cerebral';
import Model from 'cerebral/models/immutable';
import {Container} from 'cerebral-view-react';
import UserAgent from 'cerebral-module-useragent';
import Devtools from 'cerebral-module-devtools';
import DebuggerModule from './modules/Debugger';
import Debugger from './components/Debugger';

class DebuggerController extends React.Component {
  constructor(props) {
    super(props);
    this.controllers = {};
    this.state = {currentController: null}
  }
  componentDidMount() {
    onChange((payload) => {
      if (payload.type === 'init' && !this.controllers[payload.appId]) {
        this.currentController = this.controllers[payload.appId] = Controller(Model(payload.data.initialModel));
        this.currentController.addModules({
          debugger: DebuggerModule,

          devtools: process.env.NODE_ENV === 'production' ? function () {} : Devtools(),
          useragent: UserAgent({
            media: {
              small: '(max-width: 1270px)'
            }
          })
        });
      } else if (this)
      this.props.signals.debugger.payloadReceived
    });
  }
  render() {
    if (!this.currentController) {
      return <div>No app</div>;
    }
    return (
      <Container controller={this.currentController} style={{height: '100%'}}><Debugger/></Container>
    );
  }
}

export default DebuggerController;
