var React = require('react');

function hasChanged(path, changes) {
  path = Array.isArray(path) ? path : path.split('.');
  return path.reduce(function (changes, key) {
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
      this.context.controller.removeListener('flush', this.update);
    },
    update(changes) {
      var hasChange = false;
      for (var key in paths) {
        if (
          (paths[key].hasChanged && paths[key].hasChanged(changes)) ||
          (!paths[key].hasChanged && hasChanged(paths[key], changes))
        ) {
          hasChange = true;
        }
      }
      if (hasChange) {
        this.forceUpdate();
      }
    },
    getProps() {
      var controller = this.context.controller;
      var props = this.props || {};
      var propsToPass = Object.keys(paths || {}).reduce(function (props, key) {
        props[key] = paths[key].hasChanged ? paths[key].get(controller.get()) : controller.get(paths[key]);
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
