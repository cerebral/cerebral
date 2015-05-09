"use strict";

var React = require('react');
var utils = require('./utils.js');

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

  this.setState(statePaths.reduce(function(state, key, index) {
    state[key] = cerebral.get(statePaths[index]);
    return state;
  }, {}));

};

var mixin = function(component) {

  component.contextTypes = {
    cerebral: React.PropTypes.object
  };

  component.prototype.componentWillMount = componentWillMount;

  component.prototype.shouldComponentUpdate = shouldComponentUpdate;

  component.prototype.componentWillUnmount = componentWillUnmount;

  component.prototype._mergeInState = _mergeInState;

  return component;

};

module.exports = mixin;
