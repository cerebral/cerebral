"use strict";

var mixin = require('./mixin.js');
var utils = require('./utils.js');
var React = require('react');

module.exports = function() {

  var createWrapper = function(Component, state) {
    var Wrapper = React.createClass({
      mixins: [mixin],
      getCerebralState: function() {
        return state;
      },
      componentWillMount: function() {
        Component.prototype.signals = this.signals;
      },
      render: function() {
        return React.createElement(Component, utils.extend({}, this.props, this.state));
      }
    });
    return Wrapper;
  };

  if (arguments.length === 2 && typeof arguments[0] === 'function') {
    return createWrapper(arguments[0], arguments[1]);
  } else {
    var state = arguments[0] || {};
    return function(Component) {
      return createWrapper(Component, state);
    };
  }
};
