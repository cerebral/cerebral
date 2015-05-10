"use strict";

var React = require('react');
var utils = require('./utils.js');

var contextTypes = {
  cerebral: React.PropTypes.object
};

var componentWillMount = function() {
  this._mergeInState = this._mergeInState.bind(this);
  this.signals = this.context.cerebral.signals;

  if (this.getCerebralState) {
    this.context.cerebral.on('update', this._mergeInState);
    this._mergeInState();
  }
};

var shouldComponentUpdate = function(nextProps, nextState) {
  return !utils.shallowEqual(this.props, nextProps) ||
    !utils.shallowEqual(this.state, nextState);
};

var componentWillUnmount = function() {
  this.isUnMounting = true; // removeListener is async?
  this.context.cerebral.removeListener('update', this._mergeInState);
};

var _mergeInState = function() {
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

};

var mixin = function(component) {
  component.contextTypes = contextTypes;
  component.prototype.componentWillMount = componentWillMount;
  component.prototype.shouldComponentUpdate = shouldComponentUpdate;
  component.prototype.componentWillUnmount = componentWillUnmount;
  component.prototype._mergeInState = _mergeInState;
  return component;
};

mixin.contextTypes = contextTypes;
mixin.componentWillMount = componentWillMount;
mixin.shouldComponentUpdate = shouldComponentUpdate;
mixin.componentWillUnmount = componentWillUnmount;
mixin._mergeInState = _mergeInState;

module.exports = mixin;
