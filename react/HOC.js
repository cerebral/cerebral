var React = require('react');

function hasChanged(path, changes) {
  return path.split('.').reduce(function (changes, key) {
    return changes ? changes[key] : false;
  }, changes);
}

module.exports = function (Component, paths) {
  return React.createClass({
    contextTypes: {
      controller: React.PropTypes.object
    },
    componentWillMount() {
      this.context.controller.on('flush', this.update);
    },
    componentWillUnmount() {
      this.context.controller.off('flush', this.update);
    },
    update(changes) {
      for (var key in paths) {
        if (
          (typeof paths[key] === 'object' && paths[key].hasChanged(changes)) ||
          (typeof paths[key] !== 'object' && hasChanged(paths[key], changes))
        ) {
          return this.forceUpdate();
        }
      }
    },
    getProps() {
      var controller = this.context.controller;
      var props = this.props || {};
      var propsToPass = Object.keys(paths || {}).reduce(function (props, key) {
        props[key] = typeof paths[key] === 'object' ? paths[key].get(controller.get()) : controller.get(paths[key]);
        return props
      }, {})

      propsToPass = Object.keys(props).reduce(function (propsToPass, key) {
        propsToPass[key] = props[key]
        return propsToPass
      }, propsToPass)

      propsToPass.signals = this.context.controller.getSignals();

      return propsToPass
    },
    render() {
      return React.createElement(Component, this.getProps())
    }
  });
}
