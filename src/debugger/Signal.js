var React = require('react');
var DOM = React.DOM;
var Action = React.createFactory(require('./Action.js'));

var SignalStyle = {
  color: '#666',
  marginBottom: '0',
  fontSize: '1.25em',
  padding: '0 10px'
};

var ActionsStyle = {
  listStyleType: 'none',
  paddingLeft: 0
};

var Signal = React.createClass({
  renderFPS: function(duration) {

    var color = duration >= 16 ? '#d9534f' : duration >= 10 ? '#f0ad4e' : '#5cb85c';
    return DOM.strong(null, DOM.small({
      style: {
        color: color
      }
    }, ' (' + duration + 'ms)'));
  },
  renderAction: function (signal, action, index) {

    return Action({
      action: action, 
      key: index, 
      index: index, 
      signal: signal,
      getValue: this.props.getValue,
      hasExecutingAsyncSignals: this.props.hasExecutingAsyncSignals
    });

  },
  render: function() {

    return DOM.div(null,
      DOM.h2({
        style: SignalStyle
      }, DOM.span(null, this.props.signal.name, this.renderFPS(this.props.signal.duration))),
      DOM.ul({
        style: ActionsStyle
      }, this.props.signal.actions.map(this.renderAction.bind(null, this.props.signal)))
    )
  }
});

module.exports = Signal;
