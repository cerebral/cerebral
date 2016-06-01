var React = require('react');

module.exports = React.createClass({
  displayName: 'CerebralContainer',
  childContextTypes: {
    controller: React.PropTypes.object.isRequired
  },
  getChildContext: function () {
    return {
      controller: this.props.controller
    }
  },
  render: function () {
    return React.DOM.div(this.props);
  }
})
