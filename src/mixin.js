"use strict";
var React = require('react');

var utils = require('./utils.js');

var mixin = {
  contextTypes: {
    cerebral: React.PropTypes.object
  },
  componentWillMount: function() {
    this._mergeInState = this._mergeInState;
    this.signals = this.context.cerebral.signals;

    if (this.getCerebralState) {
      this.context.cerebral.on('update', this._mergeInState);
      this._mergeInState();
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return !utils.shallowEqual(this.props, nextProps) ||
      !utils.shallowEqual(this.state, nextState);
  },
  componentWillUnmount: function() {
    this.isUnMounting = true; // removeListener is async?
    this.context.cerebral.removeListener('update', this._mergeInState);
  },
  _mergeInState: function() {
    if (this.isUnMounting) {
      return true;
    }
    var statePaths = this.getCerebralState ? this.getCerebralState() : [];
    var cerebral = this.context.cerebral;

    if (Array.isArray(statePaths)) {

      this.setState(statePaths.reduce(function(state, key, index) {
        state[key] = cerebral.get(statePaths[index]);
        return state;
      }, {}));

    } else {

      this.setState(Object.keys(statePaths).reduce(function(state, key) {
        state[key] = cerebral.get(statePaths[key]);
        return state;
      }, {}));
    }
  }
};

module.exports = mixin;
