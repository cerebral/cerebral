import React from 'react';
import events from './events.js';
import {Value} from 'cerebral';

class StateComponent extends React.Component {
  constructor(props) {
    super(props);
    this._update = this._update.bind(this);
  }
  componentWillMount() {
    this.signals = this.context.controller.signals;
    this.recorder = this.context.controller.recorder;
    events.on('change', this._update);
    this._update(this.context.controller.get([]));
  }
  componentWillUnmount() {
    events.off('change', this._update);
  }
  _update(state) {
    if (!this.getStatePaths) {
      return;
    }
    var statePaths = this.getStatePaths();
    var newState = Object.keys(statePaths).reduce((newState, key) => {
      newState[key] = Value(statePaths[key], state);
      return newState;
    }, {});
    this.setState(newState);
  }
}

StateComponent.contextTypes = {
  controller: React.PropTypes.object
};

export default StateComponent;
